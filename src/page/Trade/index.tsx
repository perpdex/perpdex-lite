import React, { useState } from "react"
import { VStack, Flex, Box, HStack, Button, Divider } from "@chakra-ui/react"

import ChartHead from "./ChartHead"
import Summary from "./Summary"
import FrameContainer from "component/FrameContainer"
import TradeInput from "./TradeInput"
import PositionTab from "./PositionTab"
import Slippage from "./Slippage"
import LightWeightChart from "./LightWeightChart"
import OrderHistory from "./OrderHistory"

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
                        <OrderHistory />
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
