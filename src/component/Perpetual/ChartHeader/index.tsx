import { HStack, Text, VStack } from "@chakra-ui/react"

function ChartHeader() {
    return (
        <HStack justifyContent="space-between" alignItems="center">
            <VStack align="start">
                <Text color={"gray.200"}>Mark Price</Text>
                <Text>$2111.57</Text>
            </VStack>
            <VStack align="start">
                <Text color={"gray.200"}>Funding Rate</Text>
                <Text color={"#66BB74"}>0.0234</Text>
            </VStack>
            <VStack align="start">
                <Text color={"gray.200"}>24h Volume</Text>
                <Text>$193,465.239</Text>
            </VStack>
        </HStack>
    )
}

export default ChartHeader
