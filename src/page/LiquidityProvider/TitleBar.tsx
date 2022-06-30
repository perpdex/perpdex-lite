import { HStack, Text, VStack } from "@chakra-ui/react"

import React from "react"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"

interface Props {
    title: string
}

function TitleBar({ title }: Props) {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    return (
        <HStack justifyContent="start">
            <VStack spacing={-2} alignItems="start">
                <Text fontSize="lg" fontWeight="bold">
                    {title}
                </Text>
                {/*<Text fontSize="xs" color="gray.500">*/}
                {/*    ETH*/}
                {/*</Text>*/}
            </VStack>
        </HStack>
    )
}

export default TitleBar
