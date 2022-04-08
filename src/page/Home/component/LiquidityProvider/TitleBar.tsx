import { HStack, Text, VStack } from "@chakra-ui/react"

import React from "react"

function TitleBar() {
    return (
        <HStack justifyContent="start">
            <VStack spacing={-2} alignItems="start">
                <Text fontSize="lg" fontWeight="bold">
                    ASTR
                </Text>
                <Text fontSize="xs" color="gray.500">
                    Astar
                </Text>
            </VStack>
        </HStack>
    )
}

export default TitleBar
