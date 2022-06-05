import { VStack, Flex, Box } from "@chakra-ui/react"

import Collateral from "./Collateral"
// import Leverage from "./Leverage"
import MarketSelector from "./MarketSelector"
import Position from "./Position"
import React from "react"
import SideSwitcher from "./SideSwitcher"
import Slippage from "./Slippage"
import Summary from "./Summary"
import FrameContainer from "component/FrameContainer"

function Trade() {
    return (
        <FrameContainer>
            <Flex>
                <Box flex="1" mr="2">
                    Chart
                </Box>
                <Box w="360px">
                    <VStack spacing={6} p={0}>
                        <SideSwitcher />
                        <MarketSelector />
                        <Collateral />
                        <Position />
                        {/*<Leverage />*/}
                        <Slippage />
                        <Summary />
                    </VStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
