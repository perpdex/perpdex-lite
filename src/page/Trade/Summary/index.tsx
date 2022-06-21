import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import TxInfoTable from "./TxInfoTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import Big from "big.js"

function Summary() {
    const {
        currentMarketState: { markPrice },
    } = PerpdexMarketContainer.useContainer()

    return (
        <>
            <Heading w="full" size="md">
                Transaction Summary
            </Heading>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                <TxInfoTable markPrice={markPrice} priceImpact="" estimateGasFee={Big(0)} fundingRatio="" />
            </Box>
            <VStack spacing={2} width="full">
                <Text fontSize="sm" color="gray.500">
                    Confirm in Metamask
                </Text>
            </VStack>
        </>
    )
}

export default Summary
