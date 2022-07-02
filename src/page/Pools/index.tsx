import React, { useCallback, useMemo } from "react"
import { Heading, Text, Box } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import PoolsTable, { PoolsTableUnit } from "./PoolsTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { useHistory } from "react-router-dom"
import _ from "lodash"

function Pools() {
    const { marketStates } = PerpdexMarketContainer.useContainer()
    const history = useHistory()

    const poolsInfo: PoolsTableUnit[] = useMemo(() => {
        return _.values(marketStates)
    }, [marketStates])

    const handleOnClick = useCallback(
        (address: string) => {
            history.push(`pools/${address}`)
        },
        [history],
    )

    return (
        <FrameContainer>
            <Heading size="lg" color="#627EEA">
                Liquidity Pools
            </Heading>
            <Text mt={2}>
                Earn transaction fee on each perpetual future trade by providing liquidity on these pools.
                <br />
                You can use leverage on LP tokens as well to earn more by risking more.
            </Text>
            <Box mt={6} border={{ base: "0px none", md: "1px solid #627EEA" }} borderRadius="20px" w="100%">
                <PoolsTable data={poolsInfo} handleOnClick={handleOnClick} />
            </Box>
        </FrameContainer>
    )
}

export default Pools
