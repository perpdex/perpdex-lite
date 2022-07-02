import { Center, Divider, Flex, VStack } from "@chakra-ui/react"

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
            <Flex direction={{ base: "column", lg: "row" }} w="100%" h="100%" justifyContent="space-evenly">
                <VStack w="100%">
                    <AccountPanel myAccountInfo={currentMyAccountInfo} marketState={currentMarketState} />
                    <AccountInfoTable myAccountInfo={currentMyAccountInfo} marketState={currentMarketState} />
                </VStack>
                <Center h="100%" mx={10}>
                    <Divider orientation="vertical" borderColor="#627EEA" />
                </Center>
                <VStack spacing={10} w="100%">
                    <TradeInfoPanel />
                    <OpenPositionsTable />
                </VStack>
            </Flex>
        </FrameContainer>
    )
}

export default Home
