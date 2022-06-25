import React, { useCallback, useMemo } from "react"
import { Heading, Text, Box } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import PoolsTable, { PoolsTableUnit } from "./PoolsTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"

function Pools() {
    const { marketStates } = PerpdexMarketContainer.useContainer()

    const poolsInfo: PoolsTableUnit[] = useMemo(() => {
        const poolsArray = Object.keys(marketStates).map((key: string) => ({ ...marketStates[key], address: key }))

        return poolsArray.map(pool => {
            const poolName = pool.inverse
                ? `${pool.quoteSymbol}-${pool.baseSymbol}`
                : `${pool.baseSymbol}-${pool.quoteSymbol}`

            return {
                address: pool.address,
                poolName,
                tvl: `${pool.poolInfo.quote.mul(2).toFixed(3)} ${pool.quoteSymbol}`,
                volume24h: `10000000 ${pool.quoteSymbol}`,
            }
        })
    }, [marketStates])

    const handleOnClick = useCallback((address: string) => {
        console.log("transit to ", address)
    }, [])

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
