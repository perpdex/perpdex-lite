import { HStack, Text, VStack } from "@chakra-ui/react"

import React from "react"
import { Amm } from "../../../../container/amm"

function TitleBar() {
    const { selectedAmm } = Amm.useContainer()

    return (
        <HStack justifyContent="start">
            <VStack spacing={-2} alignItems="start">
                <Text fontSize="lg" fontWeight="bold">
                    {selectedAmm?.baseAssetSymbol}/{selectedAmm?.quoteAssetSymbol}
                </Text>
                {/*<Text fontSize="xs" color="gray.500">*/}
                {/*    ETH*/}
                {/*</Text>*/}
            </VStack>
        </HStack>
    )
}

export default TitleBar
