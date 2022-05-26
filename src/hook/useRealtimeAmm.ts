import { bigNum2Big } from "util/format"
import { useCallback, useEffect, useState } from "react"

import { AmmError } from "util/error"
import Big from "big.js"
import { Contract } from "container/contract"
import { Dir } from "constant"
import { isAddress } from "@ethersproject/address"
import { useContractEvent } from "./useContractEvent"

function sqrtPriceX96ToPrice(x: Big): Big {
    return x.div(Big(2).pow(96)).pow(2)
}

// address: base token address
export function useRealtimeAmm(address: string, name: string) {
    const { clearingHousePerpdex } = Contract.useContainer()
    const [price, setPrice] = useState<Big | null>(null)

    const getInputPrice = useCallback(
        async (dir: Dir, notional: Big): Promise<Big | null> => {
            if (price && price.gt(0)) {
                try {
                    // TODO: accurate calculation
                    return notional.div(price)
                } catch (err) {
                    throw new AmmError(name, "GetInputPrice", address)
                }
            }
            return null
        },
        [address, name, price],
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
        [address, name, price],
    )

    useEffect(() => {
        async function getPrice() {
            if (clearingHousePerpdex && isAddress(address)) {
                try {
                    // FIX
                    // const sqrtPriceX96 = await clearingHousePerpDex.getSqrtMarkPriceX96(address)
                    // setPrice(sqrtPriceX96ToPrice(bigNum2Big(sqrtPriceX96, 0)))
                } catch (err) {
                    console.log(err)
                    setPrice(Big(0))
                }
            }
        }
        getPrice()
    }, [address, clearingHousePerpdex])

    /* will receive [quoteAssetReserve, baseAssetReserve, timestamp] */
    useContractEvent(
        clearingHousePerpdex,
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
