import React, { useCallback, useMemo } from "react"
import { Heading, Text, Box } from "@chakra-ui/react"

import FrameContainer from "component/frames/FrameContainer"
import PoolsTable from "./PoolsTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { useHistory } from "react-router-dom"
import _ from "lodash"
import { MakerInfo, MarketState } from "../../constant/types"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"

function Pools() {
    const { marketStates } = PerpdexMarketContainer.useContainer()
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const history = useHistory()

    const poolsInfo: [MarketState, MakerInfo][] = useMemo(() => {
        return _.map(marketStates, (marketState, marketAddress) => {
            return [marketState, currentMyAccountInfo?.makerInfos[marketAddress]]
        })
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
            <Text marginTop={3} marginBottom={6}>
                Earn transaction fee on each perpetual future trade by providing liquidity on these pools.
                <br />
                You can use leverage on LP tokens as well to earn more by risking more.
            </Text>
            <Box mt={6} border="1px solid #627EEA" borderRadius="20px" w="100%">
                <PoolsTable data={poolsInfo} handleOnClick={handleOnClick} />
            </Box>
        </FrameContainer>
    )
}

export default Pools
