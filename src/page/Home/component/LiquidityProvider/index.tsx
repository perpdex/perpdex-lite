import { HStack, SimpleGrid, VStack } from "@chakra-ui/react"

import React from "react"
import TitleBar from "./TitleBar"

function LiquidityProvider() {
    return (
        <SimpleGrid columns={[1, null, 2]} spacing={16}>
            <VStack spacing={6} p={0}>
                <TitleBar />
                <HStack></HStack>
            </VStack>
        </SimpleGrid>
    )
}

export default LiquidityProvider
