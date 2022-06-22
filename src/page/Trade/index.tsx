import React from "react"
import { VStack, Flex, Box } from "@chakra-ui/react"

// import Leverage from "./Leverage"
import MarketSelector from "component/Perpetual/MarketSelector"
import Summary from "./Summary"
import FrameContainer from "component/FrameContainer"
import TradeInput from "./TradeInput.tsx"
import Position from "./Position"

function Trade() {
    return (
        <FrameContainer>
            <Flex>
                <Box flex="1" mr="2">
                    <MarketSelector />
                    Chart
                    <Position />
                </Box>
                <Box w="360px">
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
