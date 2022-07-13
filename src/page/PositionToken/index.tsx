import React from "react"
import { Box, Heading, Text } from "@chakra-ui/react"

import { PerpdexLongTokenContainer } from "container/connection/perpdexLongTokenContainer"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getLongTokenInfos } from "util/position"
import FrameContainer from "component/frames/FrameContainer"
import TokenTable from "./TokenTable"

function PositionToken() {
    const { longTokenStates } = PerpdexLongTokenContainer.useContainer()
    const { marketStates } = PerpdexMarketContainer.useContainer()

    const longTokenInfos = getLongTokenInfos(longTokenStates, marketStates)

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
            <Box mt={6} border={{ base: "0px none", md: "1px solid #627EEA" }} borderRadius="20px" w="100%">
                <TokenTable data={longTokenInfos} />
            </Box>
        </FrameContainer>
    )
}

export default PositionToken
