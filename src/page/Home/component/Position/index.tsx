import { PositionInfo } from "constant/position"
import { useCallback, useEffect, useState } from "react"

import { Amm } from "container/amm"
// import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Connection } from "container/connection"
import NoPosition from "./NoPosition"
import NoWallet from "./NoWallet"
import PositionUnit from "./PositionUnit"
import { SimpleGrid } from "@chakra-ui/layout"
import { bigNum2Big } from "util/format"
import { useInterval } from "@chakra-ui/hooks"
import { Contract } from "../../../../container/contract"
import { useRealtimeAmm } from "../../../../hook/useRealtimeAmm"
import Big from "big.js"

function Position() {
    const { account } = Connection.useContainer()
    const {
        clearingHousePerpdex,
        ercTokenAddress: { baseTokens },
    } = Contract.useContainer()
    const { selectedAmm } = Amm.useContainer()

    const baseTokenAddress = selectedAmm?.address || ""
    const baseAssetSymbol = selectedAmm?.baseAssetSymbol || ""
    // const quoteAssetSymbol = selectedAmm?.quoteAssetSymbol || ""
    const { price } = useRealtimeAmm(baseTokenAddress, baseAssetSymbol)
    const [positionInfo, setPositionInfo] = useState<PositionInfo>({
        address: "",
        baseAssetSymbol: "",
        quoteAssetSymbol: "",
        baseAssetSymbolDisplay: "",
        quoteAssetSymbolDisplay: "",
        tradeLimitRatio: Big(0),
        tollRatio: Big(0),
        indexPrice: Big(0),
        inverse: false,

        unrealizedPnl: Big(0),
        size: Big(0),
        margin: Big(0),
        openNotional: Big(0),
        marginRatio: Big(0),
    })

    const getTraderPositionInfo = useCallback(async () => {
        if (!account) return
        if (!baseTokens) return
        if (!clearingHousePerpdex) return
        if (!price) return
        if (!selectedAmm) return

        const positionSizeBig = await clearingHousePerpdex.getPositionSize(account, baseTokens.usd)
        const positionNotionalBig = await clearingHousePerpdex.getPositionNotional(account, baseTokens.usd)

        const takerPositionSize = bigNum2Big(positionSizeBig)
        const takerOpenNotional = bigNum2Big(positionNotionalBig)

        const info = {
            ...selectedAmm,

            unrealizedPnl: Big(0),
            size: takerPositionSize,
            margin: Big(0),
            openNotional: takerOpenNotional,
            marginRatio: Big(0.1),
        }

        if (!takerPositionSize.eq(0)) {
            const entryPrice = takerOpenNotional.abs().div(takerPositionSize.abs())
            info.unrealizedPnl = price.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))
        }

        setPositionInfo(info)
    }, [account, baseTokens, clearingHousePerpdex, price, selectedAmm])

    useEffect(() => {
        getTraderPositionInfo()
    }, [getTraderPositionInfo])

    /* update trader's position info per 5s */
    useInterval(getTraderPositionInfo, 5000)

    return (
        <SimpleGrid columns={1} spacing={8}>
            {!account && <NoWallet />}
            {account && positionInfo.size.eq(0) && <NoPosition />}
            {account && !positionInfo.size.eq(0) && (
                <PositionUnit key={positionInfo.baseAssetSymbol} data={positionInfo} />
            )}
        </SimpleGrid>
    )
}

export default Position
