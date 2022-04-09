import { SimpleGrid, VStack, Box } from "@chakra-ui/react"

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
            <SimpleGrid columns={2} spacing={8} mt="6">
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4">
                    <VStack spacing={6} p={0}>
                        {/*<Mining />*/}
                        <PoolInfo />
                    </VStack>
                </Box>
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4">
                    <VStack spacing={6} p={0}>
                        <ProvidedInfo />
                        <Position />
                    </VStack>
                </Box>
            </SimpleGrid>
        </>
    )
}

export default LiquidityProvider
