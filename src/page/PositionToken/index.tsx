import React from "react"
import { SimpleGrid, Heading, Text } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import TokenPanel from "./TokenPanel"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import _ from "lodash"

function PositionToken() {
    const { longTokenStates } = PerpdexLongTokenContainer.useContainer()
    const panels = _.map(longTokenStates, (_value, marketAddress) => {
        return <TokenPanel marketAddress={marketAddress} key={marketAddress}></TokenPanel>
    })

    return (
        <FrameContainer>
            <Heading size="md">Position Tokens</Heading>
            <Text marginTop={3} marginBottom={6}>
                Position tokens are ERC20 vault tokens composed of PerpDEX based perpatual futures contracts. These
                tokens have the qualities such as liquidation free, and 100% capital efficient.
            </Text>
            <SimpleGrid width="100%" columns={4} spacing={6}>
                {panels}
            </SimpleGrid>
        </FrameContainer>
    )
}

export default PositionToken
