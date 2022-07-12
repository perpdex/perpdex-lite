import React from "react"
import { VStack, Flex, Box, HStack, Divider } from "@chakra-ui/react"

import ChartHead from "./ChartHead"
import FrameContainer from "component/FrameContainer"
import TradeInput from "./TradeInput"
import PositionTab from "./PositionTab"
import LightWeightChart from "./LightWeightChart"
import OrderHistory from "./OrderHistory"

function Trade() {
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
                        </VStack>
                    </HStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
