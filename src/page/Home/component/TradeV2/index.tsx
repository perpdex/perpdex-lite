import { Box, VStack } from "@chakra-ui/react"

import Collateral from "./Collateral"
import Leverage from "./Leverage"
import MarketSelector from "./MarketSelector"
import Position from "./Position"
import React from "react"
import SideSwitcher from "./SideSwitcher"
import Slippage from "./Slippage"
import Summary from "./Summary"

function Trade() {
    return (
        <>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderRadius="12px">
                <SideSwitcher />
                <VStack width="100%" p="4">
                    <MarketSelector />
                    <Collateral />
                    <Position />
                    <Leverage />
                    <Slippage />
                    <Summary />
                </VStack>
            </Box>
        </>
    )
}

export default Trade
