import { HStack, Text, VStack } from "@chakra-ui/react"

import React from "react"

function TitleBar() {
    return (
        <HStack justifyContent="space-between" alignItems="start">
            <VStack spacing={-2}>
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
