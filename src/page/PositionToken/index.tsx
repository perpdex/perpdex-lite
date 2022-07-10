import React from "react"
import { Heading, Text } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import TokenTable from "./TokenTable"

function PositionToken() {
    return (
        <FrameContainer>
            <Heading size="lg" color="#627EEA">
                Position Tokens
            </Heading>
            <Text marginTop={3} marginBottom={6}>
                Position tokens are ERC20 vault tokens composed of PerpDEX based perpatual futures contracts.
                <br />
                These tokens have the qualities such as liquidation free, and 100% capital efficient.
            </Text>
            <TokenTable />
        </FrameContainer>
    )
}

export default PositionToken
