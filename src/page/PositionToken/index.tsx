import React from "react"
import { VStack, Flex, Box, Heading } from "@chakra-ui/react"

import MarketSelector from "component/Perpetual/MarketSelector"
import FrameContainer from "component/FrameContainer"
import TokenPanel from "./TokenPanel"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import _ from "lodash"

function Trade() {
    const { longTokenStates } = PerpdexLongTokenContainer.useContainer()
    const panels = _.map(longTokenStates, state => {
        return <TokenPanel longTokenState={state}></TokenPanel>
    })

    return (
        <FrameContainer>
            <Heading size="md">Position Tokens</Heading>
            <p>
                Position tokens are ERC20 vault tokens composed of PerpDEX based perpatual futures contracts. These
                tokens have the qualities such as liquidation free, and 100% capital efficient.
            </p>
            <Flex>{panels}</Flex>
        </FrameContainer>
    )
}

export default Trade
