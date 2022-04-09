import { big2Decimal, bigNum2Big, decimal2Big } from "util/format"
import { useCallback, useEffect, useMemo, useState } from "react"

import { AmmError } from "util/error"
import Big from "big.js"
import { Connection } from "container/connection"
import { NewContract } from "container/newContract"
import { Dir } from "constant"
// import { Contract as MulticallContract } from "ethers-multicall"
import { isAddress } from "@ethersproject/address"
import { useContractEvent } from "./useContractEvent"

function sqrtPriceX96ToPrice(x: Big): Big {
    return x.div(Big(2).pow(96)).pow(2)
}

// address: base token address
export function useRealtimeAmm(address: string, name: string) {
    const { multicallNetworkProvider } = Connection.useContainer()
    const { clearingHouse, exchange } = NewContract.useContainer()
    const [price, setPrice] = useState<Big | null>(null)

    const getInputPrice = useCallback(
        async (dir: Dir, notional: Big): Promise<Big | null> => {
            if (price) {
                try {
                    // TODO: accurate calculation
                    return notional.div(price)
                } catch (err) {
                    throw new AmmError(name, "GetInputPrice", address)
                }
            }
            return null
        },
        [address, name],
    )

    const getOutputPrice = useCallback(
        async (size: Big): Promise<Big | null> => {
            if (price) {
                try {
                    // TODO: accurate calculation
                    return size.mul(price)
                } catch (err) {
                    throw new AmmError(name, "GetOutputPrice", address)
                }
            }
            return null
        },
        [address, name],
    )

    useEffect(() => {
        async function getPrice() {
            if (exchange !== null && isAddress(address)) {
                try {
                    const sqrtPriceX96 = await exchange.getSqrtMarkPriceX96(address)
                    setPrice(sqrtPriceX96ToPrice(bigNum2Big(sqrtPriceX96, 0)))
                } catch (err) {
                    console.log(err)
                    setPrice(Big(0))
                }
            }
        }
        getPrice()
    }, [address, exchange])

    /* will receive [quoteAssetReserve, baseAssetReserve, timestamp] */
    useContractEvent(
        clearingHouse,
        "PositionChanged",
        (
            trader,
            baseToken,
            exchangedPositionSize,
            exchangedPositionNotional,
            fee,
            openNotional,
            realizedPnl,
            sqrtPriceAfterX96,
        ) => {
            setPrice(sqrtPriceX96ToPrice(bigNum2Big(sqrtPriceAfterX96, 0)))
        },
    )

    return {
        price,
        getInputPrice,
        getOutputPrice,
    }
}
