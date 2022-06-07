import { HStack, Text, VStack } from "@chakra-ui/react"

import React from "react"
import { PerpdexMarketContainer } from "../../container/perpdexMarketContainer"

function TitleBar() {
    const {
        state: { currentMarket },
    } = PerpdexMarketContainer.useContainer()

    return (
        <HStack justifyContent="start">
            <VStack spacing={-2} alignItems="start">
                <Text fontSize="lg" fontWeight="bold">
                    {currentMarket?.baseAssetSymbol}/{currentMarket?.quoteAssetSymbol}
                </Text>
                {/*<Text fontSize="xs" color="gray.500">*/}
                {/*    ETH*/}
                {/*</Text>*/}
            </VStack>
        </HStack>
    )
}

export default TitleBar
