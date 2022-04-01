import { HStack, SimpleGrid, VStack, Box } from "@chakra-ui/react"

import React from "react"
import TitleBar from "./TitleBar"
import Mining from "./Mining"
import ProvidedInfo from "./ProvidedInfo"
import Position from "./Position"
import PoolInfo from "./PoolInfo"

function LiquidityProvider() {
    return (
        <>
            <TitleBar />
            <SimpleGrid columns={2} spacing={8}>
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4">
                    <HStack>
                        <VStack spacing={6} p={0}>
                            <Mining />
                            <PoolInfo />
                        </VStack>
                    </HStack>
                </Box>
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4">
                    <HStack>
                        <VStack spacing={6} p={0}>
                            <ProvidedInfo />
                            <Position />
                        </VStack>
                    </HStack>
                </Box>
            </SimpleGrid>
        </>
    )
}

export default LiquidityProvider
