import { Heading } from "@chakra-ui/react"
import AccountInfoTable from "./AccountInfoTable"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "../../../container/connection/perpdexExchangeContainer"

function Summary() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { currentMyAccountInfo, currentExchangeState } = PerpdexExchangeContainer.useContainer()

    return (
        <>
            <Heading w="full" size="md">
                Account Summary
            </Heading>
            <AccountInfoTable
                myAccountInfo={currentMyAccountInfo}
                marketState={currentMarketState}
                exchangeState={currentExchangeState}
            />
        </>
    )
}

export default Summary
