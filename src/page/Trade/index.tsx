import React from "react"
import { VStack, Flex, Box } from "@chakra-ui/react"

// import Leverage from "./Leverage"
import ChartHead from "./ChartHead"
import Summary from "./Summary"
import FrameContainer from "component/FrameContainer"
import TradeInput from "./TradeInput"
import PositionTab from "./PositionTab"
import LightWeightChart from "./LightWeightChart"

function Trade() {
    return (
        <FrameContainer removeMarginTop>
            <Flex>
                <Box flex="1" mr="2" mt="0">
                    <ChartHead />
                    <LightWeightChart />
                    <PositionTab />
                </Box>
                <Box w="360px" mt="8">
                    <VStack spacing={6} p={0}>
                        <TradeInput />
                        {/* <Leverage /> */}
                        <Summary />
                    </VStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
