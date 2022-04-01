import { Box, Heading, VStack, Text, Button } from "@chakra-ui/react"
import { ArrowUpIcon } from "@chakra-ui/icons"

function Mining() {
    return (
        <>
            <Box
                width="100%"
                bgGradient="linear(to-tr, purple.900, teal.900)"
                borderStyle="solid"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="12px"
            >
                <VStack alignItems="flex-start" textAlign="left" p="7" spacing="24px">
                    <Heading size="sm" bgGradient="linear(to-b, orange.100, purple.300)" bgClip="text">
                        Liquidity Mining
                    </Heading>
                    <Text>
                        Earn PERP by providing liquidity! The more trading fees you earn proportionately in a week, the
                        higher % you can claim from the liquidity mining rewards.
                    </Text>
                    <Button rightIcon={<ArrowUpIcon />} colorScheme="gray" variant="solid" size="xs">
                        Claim Here
                    </Button>
                </VStack>
            </Box>
        </>
    )
}

export default Mining
