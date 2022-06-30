import { Box, Flex, HStack, Text } from "@chakra-ui/react"

function TradeInfoPanel() {
    return (
        <>
            <HStack w="100%" justifyContent="space-evenly" mt={10}>
                <Box w={44} h={40} borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>Margin Ratio</Text>
                        <Text>$65</Text>
                    </Flex>
                </Box>
                <Box w={44} h={40} background="#31396C" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>Leverage</Text>
                        <Text>3.9x</Text>
                    </Flex>
                </Box>
            </HStack>
            <HStack w="100%" justifyContent="space-evenly">
                <Box w={44} h={40} background="#31396C" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>Funding Rewards</Text>
                        <Text>$65</Text>
                    </Flex>
                </Box>
                <Box w={44} h={40} borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>Total PnL</Text>
                        <Text>$65</Text>
                    </Flex>
                </Box>
            </HStack>
        </>
    )
}

export default TradeInfoPanel
