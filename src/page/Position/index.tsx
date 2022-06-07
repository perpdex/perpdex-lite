// import { PositionInfo } from "constant/position"
import { useCallback, useEffect } from "react"

import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
// import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { Connection } from "container/connection"
// import NoPosition from "./NoPosition"
import NoWallet from "./NoWallet"
// import PositionUnit from "./PositionUnit"
import { SimpleGrid } from "@chakra-ui/layout"
import { bigNum2Big } from "util/format"
import { useInterval } from "@chakra-ui/hooks"
import { Contract } from "../../container/contract"
import Big from "big.js"
import FrameContainer from "component/FrameContainer"

function Position() {
    const { account } = Connection.useContainer()
    const { perpdexExchange } = Contract.useContainer()
    const {
        state: { currentMarket, contract, markPrice },
    } = PerpdexMarketContainer.useContainer()

    // const baseTokenAddress = selectedAmm?.address || ""
    // const baseAssetSymbol = selectedAmm?.baseAssetSymbol || ""
    // const quoteAssetSymbol = selectedAmm?.quoteAssetSymbol || ""
    // const { price } = useRealtimeAmm(baseTokenAddress, baseAssetSymbol)

    // const [positionInfo, setPositionInfo] = useState<PositionInfo>({
    //     address: "",
    //     baseAssetSymbol: "",
    //     quoteAssetSymbol: "",
    //     baseAssetSymbolDisplay: "",
    //     quoteAssetSymbolDisplay: "",
    //     tradeLimitRatio: Big(0),
    //     tollRatio: Big(0),
    //     indexPrice: Big(0),
    //     inverse: false,

    //     unrealizedPnl: Big(0),
    //     size: Big(0),
    //     margin: Big(0),
    //     openNotional: Big(0),
    //     marginRatio: Big(0),
    // })

    const getTraderPositionInfo = useCallback(async () => {
        if (!account) return
        if (!perpdexExchange) return
        if (!contract) return
        if (!markPrice) return

        const positionSizeBig = await perpdexExchange.getPositionShare(account, contract.address) // FIX: marke should be address
        const positionNotionalBig = await perpdexExchange.getPositionNotional(account, contract.address)

        const takerPositionSize = bigNum2Big(positionSizeBig)
        const takerOpenNotional = bigNum2Big(positionNotionalBig)

        const info = {
            ...currentMarket,
            unrealizedPnl: Big(0),
            size: takerPositionSize,
            margin: Big(0),
            openNotional: takerOpenNotional,
            marginRatio: Big(0.1),
        }

        if (!takerPositionSize.eq(0)) {
            const entryPrice = takerOpenNotional.abs().div(takerPositionSize.abs())
            info.unrealizedPnl = markPrice.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))
        }

        // setPositionInfo(info)
    }, [account, contract, currentMarket, markPrice, perpdexExchange])

    useEffect(() => {
        getTraderPositionInfo()
    }, [getTraderPositionInfo])

    /* update trader's position info per 5s */
    useInterval(getTraderPositionInfo, 5000)

    return (
        <FrameContainer>
            <SimpleGrid columns={1} spacing={8}>
                {!account && <NoWallet />}
                {/* {account && positionInfo.size.eq(0) && <NoPosition />} */}
                {/* {account && !positionInfo.size.eq(0) && (
                    <PositionUnit key={positionInfo.baseAssetSymbol} data={positionInfo} />
                )} */}
            </SimpleGrid>
        </FrameContainer>
    )
}

export default Position
