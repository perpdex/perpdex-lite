import { Center, Divider, Flex, VStack } from "@chakra-ui/react"

import FrameContainer from "component/frames/FrameContainer"
import AccountPanel from "../../component/AccountPanel"
import AccountInfoTable from "component/tables/AccountInfoTable"
import TradeInfoPanel from "component/TradeInfoPanel"
import OpenPositionsTable from "component/tables/OpenPositionsTable"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"
import { User } from "../../container/connection/user"
import { AccountPerpdex } from "../../container/perpetual/account"
import { getAllPositionsFromTakerInfos } from "util/position"
import { useMemo } from "react"

function Home() {
    const {
        state: { address },
    } = User.useContainer()
    const {
        actions: { openAccountModal },
    } = AccountPerpdex.useContainer()
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState, marketStates, setCurrentMarket } = PerpdexMarketContainer.useContainer()

    const positions = useMemo(
        () =>
            currentMyAccountInfo?.takerInfos &&
            getAllPositionsFromTakerInfos(currentMyAccountInfo.takerInfos, marketStates),
        [currentMyAccountInfo?.takerInfos, marketStates],
    )

    return (
        <FrameContainer>
            <Flex direction={{ base: "column", lg: "row" }} w="100%" h="100%" justifyContent="space-evenly">
                <VStack w="100%">
                    <AccountPanel myAccountInfo={currentMyAccountInfo} marketState={currentMarketState} />
                    <AccountInfoTable
                        accountAvailable={!!address}
                        openAccountModal={openAccountModal}
                        myAccountInfo={currentMyAccountInfo}
                        marketState={currentMarketState}
                    />
                </VStack>
                <Center h="100%" mx={10}>
                    <Divider orientation="vertical" borderColor="#627EEA" />
                </Center>
                <VStack spacing={10} w="100%">
                    <TradeInfoPanel myAccountInfo={currentMyAccountInfo} />
                    <OpenPositionsTable
                        data={positions}
                        handleOnClick={(address: string) => setCurrentMarket(address)}
                    />
                </VStack>
            </Flex>
        </FrameContainer>
    )
}

export default Home
