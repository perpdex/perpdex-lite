import { Tabs, TabList, Tab, TabPanels, TabPanel, chakra, Divider } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Modal } from "container/modal"
import { useMemo } from "react"
import PositionTable, { PositionTableState } from "./PositionTable"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import OrderHistoryTable from "./OrderHistoryTable"

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

    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white", borderBottom: "1px solid #627EEA" },
        },
    })

    return (
        <Tabs variant="unstyled" mb="30px">
            <TabList my={2}>
                <StyledTab>Positions</StyledTab>
                <StyledTab>Trade History</StyledTab>
            </TabList>
            <Divider borderColor="#627EEA" />

            <TabPanels>
                <TabPanel>
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
                    <OrderHistoryTable />
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default PositionTab
