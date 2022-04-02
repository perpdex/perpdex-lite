import { AddIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"

function Position() {
    return (
        <>
            <Box width="100%">
                <HStack justifyContent="space-between">
                    <Heading size="sm">Liquidity Positions</Heading>
                    <Button leftIcon={<AddIcon />} colorScheme="pink" variant="solid" size="xs">
                        Add Liquidity
                    </Button>
                </HStack>
            </Box>
        </>
    )
}

export default Position
