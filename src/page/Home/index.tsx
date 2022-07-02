import { HStack, StackDivider, VStack } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import AccountPanel from "../../component/AccountPanel"
import AccountInfoTable from "component/AccountInfoTable"
import TradeInfoPanel from "component/TradeInfoPanel"
import OpenPositionsTable from "component/OpenPositionsTable"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"

function Home() {
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    return (
        <FrameContainer>
            <HStack justifyContent="space-evenly" divider={<StackDivider borderColor="#627EEA" />} spacing={10}>
                <VStack>
                    <AccountPanel myAccountInfo={currentMyAccountInfo} marketState={currentMarketState} />
                    <AccountInfoTable marketState={currentMarketState} />
                </VStack>
                <VStack spacing={10}>
                    <TradeInfoPanel />
                    <OpenPositionsTable />
                </VStack>
            </HStack>
            {/* <AssetInfo /> */}
        </FrameContainer>
    )
}

export default Home
