import { Heading } from "@chakra-ui/react"
import TxInfoTable from "./TxInfoTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import Big from "big.js"

function Summary() {
    const {
        currentMarketState: { markPrice },
    } = PerpdexMarketContainer.useContainer()

    return (
        <>
            <Heading w="full" size="md" mb={8}>
                Transaction Summary
            </Heading>
            <TxInfoTable markPrice={markPrice} priceImpact="" estimateGasFee={Big(0)} fundingRatio="" />
        </>
    )
}

export default Summary
