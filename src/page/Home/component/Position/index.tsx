import { ContractCall, Contract as MulticallContract } from "ethers-multicall"
import { PnlCalcOption, PositionInfo } from "constant/position"
import { useCallback, useEffect, useState } from "react"

import { Amm } from "container/amm"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Connection } from "container/connection"
import NoPosition from "./NoPosition"
import NoWallet from "./NoWallet"
import PositionUnit from "./PositionUnit"
import { SimpleGrid } from "@chakra-ui/layout"
import { bigNum2Big, decimal2Big } from "util/format"
import { useInterval } from "@chakra-ui/hooks"
import { NewContract } from "../../../../container/newContract"
import { useRealtimeAmm } from "../../../../hook/useRealtimeAmm"
import Big from "big.js"
import { BigNumber } from "ethers"

function Position() {
    const { account } = Connection.useContainer()
    const { addressMap, accountBalance } = NewContract.useContainer()
    const { ammMap, selectedAmm } = Amm.useContainer()

    const baseTokenAddress = selectedAmm?.address || ""
    const baseAssetSymbol = selectedAmm?.baseAssetSymbol || ""
    const quoteAssetSymbol = selectedAmm?.quoteAssetSymbol || ""
    const { price } = useRealtimeAmm(baseTokenAddress, baseAssetSymbol)
    const [positionInfo, setPositionInfo] = useState<PositionInfo>({
        address: "",
        baseAssetSymbol: "",
        quoteAssetSymbol: "",
        tradeLimitRatio: Big(0),
        tollRatio: Big(0),
        indexPrice: Big(0),

        unrealizedPnl: Big(0),
        size: Big(0),
        margin: Big(0),
        openNotional: Big(0),
        marginRatio: Big(0),
    })

    const getTraderPositionInfo = useCallback(async () => {
        if (!account) return
        if (!accountBalance) return
        if (!baseTokenAddress) return
        if (!price) return
        if (!selectedAmm) return

        const [
            takerPositionSizeRaw,
            takerOpenNotionalRaw,
            lastTwPremiumGrowthGlobalX96,
        ] = await accountBalance.getAccountInfo(account, baseTokenAddress)

        const takerPositionSize = bigNum2Big(takerPositionSizeRaw)
        const takerOpenNotional = bigNum2Big(takerOpenNotionalRaw)

        const info = {
            address: baseTokenAddress,
            baseAssetSymbol: baseAssetSymbol,
            quoteAssetSymbol: quoteAssetSymbol,
            tradeLimitRatio: selectedAmm.tradeLimitRatio,
            tollRatio: selectedAmm.tollRatio,
            indexPrice: selectedAmm.indexPrice,

            unrealizedPnl: Big(0),
            size: takerPositionSize,
            margin: Big(0),
            openNotional: takerOpenNotional,
            marginRatio: Big(0.1),
        }

        setPositionInfo(info)
    }, [account, accountBalance, baseTokenAddress, price, selectedAmm])

    useEffect(() => {
        getTraderPositionInfo()
    }, [getTraderPositionInfo])

    /* update trader's position info per 5s */
    useInterval(getTraderPositionInfo, 5000)

    return (
        <SimpleGrid columns={1} spacing={8}>
            {!account && <NoWallet />}
            {account && positionInfo.size.eq(0) && <NoPosition />}
            {account && positionInfo.size.gt(0) && (
                <PositionUnit key={positionInfo.baseAssetSymbol} data={positionInfo} />
            )}
        </SimpleGrid>
    )
}

export default Position
