import { Tabs, TabList, Tab, TabPanels, TabPanel, chakra, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react"
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

    const StyledTab = chakra(Tab, {
        baseStyle: {
            color: "gray.200",
            _selected: { color: "white", borderBottom: "1px solid #627EEA", paddingBottom: "2px" },
        },
    })

    const StyledTh = chakra(Th, {
        baseStyle: {
            color: "white",
            borderBottom: "0px none",
            fontWeight: "bold",
        },
    })

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    return (
        <Tabs variant="unstyled">
            <TabList>
                <StyledTab>Positions</StyledTab>
                <StyledTab>Order History</StyledTab>
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
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <StyledTh>Time</StyledTh>
                                <StyledTh>Asset</StyledTh>
                                <StyledTh>Position Size</StyledTh>
                                <StyledTh>Market Side</StyledTh>
                                <StyledTh>Realized PnL</StyledTh>
                                <StyledTh>Trading Fee</StyledTh>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <StyledTd>aaaaaa</StyledTd>
                                <StyledTd>aaaaa</StyledTd>
                                <StyledTd>aaaaa</StyledTd>
                                <StyledTd>aaaaa</StyledTd>
                                <StyledTd>aaaa</StyledTd>
                                <StyledTd>aaaaa</StyledTd>
                            </Tr>
                        </Tbody>
                    </Table>
                    {/* <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Market</Th>
                                <Th>Qty</Th>
                                <Th>Value </Th>
                                <Th>Entry Price</Th>
                                <Th>Mark Price</Th>
                                <Th>Liq. price</Th>
                                <Th>Unrealzied PNL</Th>
                                <Th>Close Position</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td>aaaaaa</Td>
                                <Td>
                                    <Text color={"green.300"}>aaaaaa</Text>
                                </Td>
                                <Td>aaaaa</Td>
                                <Td>aaaaa</Td>
                                <Td>aaaaa</Td>
                                <Td>aaaa</Td>
                                <Td>aaaaa</Td>
                                <Td>
                                    <Button mb={[4, 0]} colorScheme="blue">
                                        Close Market
                                    </Button>
                                </Td>
                            </Tr>
                        </Tbody>
                    </Table> */}
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default PositionTab
