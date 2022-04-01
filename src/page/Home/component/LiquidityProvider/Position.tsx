import { AddIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"

function Position() {
    return (
        <>
            <HStack>
                <Heading size="sm">Liquidity Positions</Heading>
                <Button leftIcon={<AddIcon />} colorScheme="pink" variant="solid" size="xs">
                    Add Liquidity
                </Button>
            </HStack>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                aa
            </Box>
        </>
    )
}

export default Position
