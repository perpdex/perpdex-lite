// import { PositionInfo } from "constant/position"
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Modal } from "container/modal"
import { useMemo } from "react"
// import { Position } from "container/perpetual/position"
import PositionTable, { PositionTableState } from "./PositionTable"
// import NoPosition from "./NoPosition"
// import NoWallet from "./NoWallet"
// import PositionUnit from "./PositionUnit"
// import { SimpleGrid } from "@chakra-ui/layout"
// import FrameContainer from "component/FrameContainer"
// import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
// import { BIG_ZERO } from "constant"
// import { useMemo } from "react"

function PositionTab() {
    const { currentMyTakerPositions } = PerpdexExchangeContainer.useContainer()
    const {
        actions: { togglePositionCloseModal },
    } = Modal.useContainer()

    const positionTableData: Omit<PositionTableState, "handleOnClick"> | undefined = useMemo(() => {
        if (currentMyTakerPositions) {
            return {
                market: currentMyTakerPositions.market,
                isLong: currentMyTakerPositions.isLong,
                positionQuantity: currentMyTakerPositions.positionQuantity.abs().toFixed(2),
                positionValue: currentMyTakerPositions.positionValue.abs().toFixed(2),
                entryPrice: currentMyTakerPositions.entryPrice.toFixed(7),
                markPrice: currentMyTakerPositions.markPrice.toFixed(7),
                liqPrice: currentMyTakerPositions.liqPrice.toFixed(7),
                unrealizedPnl: currentMyTakerPositions.unrealizedPnl.toFixed(4),
            }
        }
        return undefined
    }, [currentMyTakerPositions])
    // TODO: do not depend on contract directly from page
    // const { perpdexExchange } = Contract.useContainer()
    // const { currentMarketState } = PerpdexMarketContainer.useContainer()
    // const { currentMyTakerInfo } = PerpdexExchangeContainer.useContainer()

    // const positionData = useMemo(() => {
    //     if (!currentMyTakerInfo || !currentMarketState) return undefined

    //     const markPrice = currentMarketState.markPrice
    //     const inverse = currentMarketState.inverse
    //     const baseSymbolDisplay = inverse ? currentMarketState.quoteSymbol : currentMarketState.baseSymbol
    //     const quoteSymbolDisplay = inverse ? currentMarketState.baseSymbol : currentMarketState.quoteSymbol

    //     const size = inverse ? currentMyTakerInfo.quoteBalance : currentMyTakerInfo.baseBalanceShare
    //     const side = size.eq(0) ? null : size.gt(0) ? "Long" : "Short"

    //     return {
    //         marketPair: `${baseSymbolDisplay}/${quoteSymbolDisplay}`,
    //         markPrice,
    //         baseSymbolDisplay,
    //         quoteSymbolDisplay,
    //         size,
    //         side,
    //         estimatedLiquidationPrice: BIG_ZERO, // FIX
    //         unrealizedPnl: BIG_ZERO, // FIX
    //         averageEntryPrice: BIG_ZERO, // FIX
    //     }
    // }, [currentMarketState, currentMyTakerInfo])

    return (
        <Tabs>
            <TabList>
                <Tab>Positions</Tab>
                <Tab>Closed PL</Tab>
            </TabList>

            <TabPanels>
                <TabPanel padding={0}>
                    {positionTableData && (
                        <PositionTable
                            market={positionTableData.market}
                            isLong={positionTableData.isLong}
                            positionQuantity={positionTableData.positionQuantity}
                            positionValue={positionTableData.positionValue}
                            entryPrice={positionTableData.entryPrice}
                            markPrice={positionTableData.markPrice}
                            liqPrice={positionTableData.liqPrice}
                            unrealizedPnl={positionTableData.unrealizedPnl}
                            handleOnClick={togglePositionCloseModal}
                        />
                    )}
                </TabPanel>
                <TabPanel>
                    <p>Closed P&L!</p>
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default PositionTab
