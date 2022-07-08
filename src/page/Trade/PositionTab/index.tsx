import {
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    chakra,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Divider,
    Button,
    HStack,
    Text,
} from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Modal } from "container/modal"
import { useEffect, useMemo } from "react"
import { PositionTableState } from "./PositionTable"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import { callSubquery } from "util/subquery"
import { candles } from "queries/trades"

function PositionTab() {
    const { currentMyTakerPositions } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const {
        actions: { togglePositionCloseModal },
    } = Modal.useContainer()

    useEffect(() => {
        ;(async () => {
            const candlesData = await callSubquery(candles)
            console.log("candlesData", candlesData)
        })()
    }, [])

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
        <Tabs variant="unstyled" mb="30px">
            <TabList my={2}>
                <StyledTab>Positions</StyledTab>
                <StyledTab>Order History</StyledTab>
            </TabList>
            <Divider borderColor="#627EEA" />

            <TabPanels>
                <TabPanel padding={0}>
                    <HStack p={6}>
                        <Table variant="simple">
                            <Tbody>
                                <Tr>
                                    <StyledTd>
                                        <Text fontSize="xl" fontStyle="bold">
                                            Bitcoin - BTC
                                        </Text>
                                    </StyledTd>
                                    <StyledTd>Short</StyledTd>
                                    <StyledTd>Account Margin Ratio</StyledTd>
                                    <StyledTd>45.3%</StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd>Amount (BTC)</StyledTd>
                                    <StyledTd>0.23147</StyledTd>
                                    <StyledTd>Liquidation Price</StyledTd>
                                    <StyledTd>$29787.78</StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd>Amount (USD)</StyledTd>
                                    <StyledTd>$4000</StyledTd>
                                    <StyledTd>Leverage</StyledTd>
                                    <StyledTd>4.2x</StyledTd>
                                </Tr>
                                <Tr>
                                    <StyledTd>Avg. Open Price</StyledTd>
                                    <StyledTd>$32680.78</StyledTd>
                                    <StyledTd>Profit/Loss</StyledTd>
                                    <StyledTd>$350.27</StyledTd>
                                </Tr>
                            </Tbody>
                        </Table>
                        <Button color="white" bgColor="#353E80" borderRadius="10px">
                            Close Position
                        </Button>
                    </HStack>
                    {/* {positionTableData && (
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
                    )} */}
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
                </TabPanel>
            </TabPanels>
        </Tabs>
    )
}

export default PositionTab
