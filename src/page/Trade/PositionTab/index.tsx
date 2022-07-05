import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Modal } from "container/modal"
import { useMemo } from "react"
import PositionTable, { PositionTableState } from "./PositionTable"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"

function PositionTab() {
    const { currentMyTakerPositions } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const {
        actions: { togglePositionCloseModal },
    } = Modal.useContainer()

    const positionTableData: Omit<PositionTableState, "handleOnClick"> | undefined = useMemo(() => {
        if (currentMyTakerPositions) {
            return {
                marketState: currentMarketState,
                isLong: currentMyTakerPositions.isLong,
                positionQuantity: currentMyTakerPositions.positionQuantity.abs().toFixed(7),
                positionValue: currentMyTakerPositions.positionValue.abs().toFixed(7),
                entryPriceDisplay: currentMyTakerPositions.entryPriceDisplay,
                markPriceDisplay: currentMarketState.markPriceDisplay,
                liqPriceDisplay: currentMyTakerPositions.liqPriceDisplay,
                unrealizedPnl: currentMyTakerPositions.unrealizedPnl.toFixed(4),
            }
        }
        return undefined
    }, [currentMyTakerPositions, currentMarketState])

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
                            marketState={positionTableData.marketState}
                            isLong={positionTableData.isLong}
                            positionQuantity={positionTableData.positionQuantity}
                            positionValue={positionTableData.positionValue}
                            entryPriceDisplay={positionTableData.entryPriceDisplay}
                            markPriceDisplay={positionTableData.markPriceDisplay}
                            liqPriceDisplay={positionTableData.liqPriceDisplay}
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
