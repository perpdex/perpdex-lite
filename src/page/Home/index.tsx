import { VStack } from "@chakra-ui/react"

import FrameContainer from "component/frames/FrameContainer"
import AccountPanel from "../../component/AccountPanel"
import AccountInfoTable from "component/tables/AccountInfoTable"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"
import { User } from "../../container/connection/user"
import { AccountPerpdex } from "../../container/perpetual/account"

function Home() {
    const {
        state: { address },
    } = User.useContainer()
    const {
        actions: { openAccountModal },
    } = AccountPerpdex.useContainer()
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    return (
        <FrameContainer>
            <VStack w="100%" alignItems="normal">
                <AccountPanel myAccountInfo={currentMyAccountInfo} marketState={currentMarketState} />
                <AccountInfoTable
                    accountAvailable={!!address}
                    openAccountModal={openAccountModal}
                    myAccountInfo={currentMyAccountInfo}
                    marketState={currentMarketState}
                />
            </VStack>
        </FrameContainer>
    )
}

export default Home
