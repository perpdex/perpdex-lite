import { QuestionOutlineIcon } from "@chakra-ui/icons"
import { Box, Heading, Popover, PopoverBody, PopoverContent, PopoverTrigger, SimpleGrid, Text } from "@chakra-ui/react"
import { PerpdexMarketContainer } from "../../container/perpdexMarketContainer"

function PoolInfoTable() {
    const {
        state: { currentMarketInfo },
    } = PerpdexMarketContainer.useContainer()

    return (
        <>
            <Heading w="full" size="sm">
                Pool Info
            </Heading>
            <SimpleGrid width="100%" columns={2} spacing={6}>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Pool Base APR{" "}
                        <Popover trigger="hover">
                            <PopoverTrigger>
                                <QuestionOutlineIcon></QuestionOutlineIcon>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverBody>The est. APR from trading fees</PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Text>
                    <Text fontSize="xl" color="green.400" fontWeight="bold" lineHeight="1.4">
                        -
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Pool Rewards APR{" "}
                        <Popover trigger="hover">
                            <PopoverTrigger>
                                <QuestionOutlineIcon></QuestionOutlineIcon>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverBody>The est. APR from liquidity mining rewards</PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Text>
                    <Text fontSize="xl" color="green.400" fontWeight="bold" lineHeight="1.4">
                        -
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Mark Price
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        -
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        TVL
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        - {currentMarketInfo?.quoteAssetSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Volume (24h)
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        - {currentMarketInfo?.quoteAssetSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        24h Fees
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        - {currentMarketInfo?.quoteAssetSymbol}
                    </Text>
                </Box>
            </SimpleGrid>
        </>
    )
}

export default PoolInfoTable
