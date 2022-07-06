import React, { useState } from "react"
import { VStack, Flex, Box, HStack, Text, Thead, Table, Tr, Th, Tbody, Td, Button, Divider } from "@chakra-ui/react"

import ChartHead from "./ChartHead"
import Summary from "./Summary"
import FrameContainer from "component/FrameContainer"
import TradeInput from "./TradeInput"
import PositionTab from "./PositionTab"
import Slippage from "./Slippage"
import LightWeightChart from "./LightWeightChart"

function Trade() {
    const [slippage, setSlippage] = useState<number>(0.5)

    return (
        <FrameContainer removeMarginTop>
            <Flex direction={{ base: "column", lg: "row" }}>
                <Box flex="1">
                    <Flex direction={{ base: "column", lg: "row" }} alignItems={{ base: "center", lg: "flex-start" }}>
                        <VStack alignItems="stretch">
                            <ChartHead />
                            <LightWeightChart />
                        </VStack>
                        <Box
                            borderLeft="1px solid rgba(98, 126, 234, 0.6)"
                            p={6}
                            mx="0"
                            marginInlineStart={[0, "0 !important"]}
                            sx={{
                                "@media screen and (max-width: 61em)": {
                                    borderLeft: "0px none",
                                    marginTop: "20px",
                                },
                            }}
                        >
                            <Text align="center" color={"gray.200"}>
                                Order History
                            </Text>
                            <Table variant="simple" overflowY="scroll">
                                <Thead>
                                    <Tr>
                                        <Th border="0px" color="white">
                                            Size(ETH)
                                        </Th>
                                        <Th border="0px" color="white">
                                            Price(USD)
                                        </Th>
                                        <Th border="0px" color="white">
                                            Time
                                        </Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    <Tr>
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr bg="rgba(98, 126, 234, 0.2)">
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr>
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr bg="rgba(98, 126, 234, 0.2)">
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr bg="rgba(98, 126, 234, 0.2)">
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr>
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr bg="rgba(98, 126, 234, 0.2)">
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                    <Tr>
                                        <Td border="0px">0.32</Td>
                                        <Td border="0px">$230.32</Td>
                                        <Td border="0px">10:15:12</Td>
                                    </Tr>
                                </Tbody>
                            </Table>
                        </Box>
                    </Flex>
                    <Divider
                        borderColor="#627EEA"
                        sx={{
                            "@media screen and (max-width: 61em)": {
                                display: "none",
                            },
                        }}
                    />
                    <PositionTab />
                </Box>
                <Box w="100%">
                    <HStack spacing={8} justifyContent="center">
                        <Divider
                            orientation="vertical"
                            border="1px"
                            borderColor="rgba(98, 126, 234, 0.6)"
                            h="1000px"
                            sx={{
                                "@media screen and (max-width: 61em)": {
                                    display: "none",
                                },
                            }}
                        />
                        <VStack spacing={10} p={0}>
                            <TradeInput />
                            <Box background="#181B41" borderRadius="10px" p={6} w="100%">
                                <Summary />
                            </Box>
                            <Box background="#181B41" borderRadius="10px" p={6} w="100%">
                                <Slippage slippage={slippage} setSlippage={setSlippage} />
                            </Box>
                            <Button color="white" bgColor="#353E80" borderRadius="10px">
                                Confirm Transaction
                            </Button>
                        </VStack>
                    </HStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
