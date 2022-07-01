import { HStack, Text, VStack } from "@chakra-ui/react"

import React from "react"

interface Props {
    title: string
}

function TitleBar({ title }: Props) {
    return (
        <HStack justifyContent="start">
            <VStack spacing={-2} alignItems="start">
                <Text fontSize="lg" fontWeight="bold">
                    {title}
                </Text>
            </VStack>
        </HStack>
    )
}

export default TitleBar
