import React, { useState } from "react"
import {
    VStack,
    Flex,
    Box,
    HStack,
    Center,
    Divider,
    Text,
    Thead,
    Table,
    Tr,
    Th,
    Tbody,
    Td,
    Button,
} from "@chakra-ui/react"

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
            <Flex>
                <Box flex="1" mr="2">
                    <HStack alignItems="flex-start">
                        <VStack>
                            <HStack justifyContent="start">
                                <Box h="100%">
                                    <HStack>
                                        <Center h="100px" mx={10}>
                                            <Divider orientation="vertical" border="1px" borderColor="#D9D9D9" />
                                        </Center>
                                    </HStack>
                                </Box>
                                <Box w="100%" alignSelf="center">
                                    <ChartHead />
                                </Box>
                            </HStack>
                            <LightWeightChart />
                        </VStack>
                        <Box
                            borderColor="#728BEC"
                            borderWidth="1px"
                            borderRadius="10px"
                            p={6}
                            mx={{ base: "auto", md: "0" }}
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
                                </Tbody>
                            </Table>
                        </Box>
                    </HStack>
                    <PositionTab />
                </Box>
                <Box w="360px">
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
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
