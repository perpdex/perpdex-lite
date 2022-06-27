import React, { useCallback, useMemo } from "react"
import { Heading, Text, Box } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import PoolsTable, { PoolsTableUnit } from "./PoolsTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { useHistory } from "react-router-dom"
import { MarketStateWithAddress } from "constant/types"
import { createPoolSummary } from "util/market"

function Pools() {
    const { marketStates } = PerpdexMarketContainer.useContainer()
    const history = useHistory()

    const poolsInfo: PoolsTableUnit[] = useMemo(() => {
        const poolsArray: MarketStateWithAddress[] = Object.keys(marketStates).map((key: string) => ({
            ...marketStates[key],
            address: key,
        }))

        return poolsArray.map((pool: MarketStateWithAddress) => createPoolSummary(pool))
    }, [marketStates])

    const handleOnClick = useCallback(
        (address: string) => {
            history.push(`pools/${address}`)
        },
        [history],
    )

    return (
        <FrameContainer>
            <Heading size="md">Liquidity Pools</Heading>
            <Text mt={2}>
                Earn transaction fee on each perpetual future trade by providing liquidity on these pools.
                <br />
                You can use leverage on LP tokens as well to earn more by risking more.
            </Text>
            <Box mt={6} borderWidth="1px" borderRadius="lg">
                <PoolsTable data={poolsInfo} handleOnClick={handleOnClick} />
            </Box>
        </FrameContainer>
    )
}

export default Pools
