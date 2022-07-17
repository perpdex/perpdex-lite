import { QuestionOutlineIcon } from "@chakra-ui/icons"
import {
    Text,
    SimpleGrid,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    // Divider,
    // Center,
    // VStack,
    // Flex,
    // HStack,
} from "@chakra-ui/react"
import { MarketState, MakerPositionInfo } from "../../constant/types"
import { numberWithCommas } from "../../util/format"
import BorderFramePanel from "component/frames/BorderFramePanel"

interface YourLiquidityState {
    marketInfo?: MarketState
    makerPositionInfo: MakerPositionInfo
}

function YourLiquidity({ marketInfo, makerPositionInfo }: YourLiquidityState) {
    const collateralSymbol = marketInfo && marketInfo.quoteSymbol

    return (
        <BorderFramePanel title="Your Liquidity">
            <SimpleGrid width="100%" columns={2} spacing={6}>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Total Liquidity
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {numberWithCommas(makerPositionInfo.liquidityValue)} {collateralSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Unrealized Pnl{" "}
                        <Popover trigger="hover">
                            <PopoverTrigger>
                                <QuestionOutlineIcon></QuestionOutlineIcon>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverBody>
                                    Total fees earned from current liquidity. Added to Free Collateral automatically.
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </Text>
                    <Text fontSize="xl" color="green.400" fontWeight="bold" lineHeight="1.4">
                        {numberWithCommas(makerPositionInfo.unrealizedPnl)} {collateralSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Base assets
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {numberWithCommas(makerPositionInfo.baseAmount)} {marketInfo?.baseSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Quote assets
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {numberWithCommas(makerPositionInfo.quoteAmount)} {marketInfo?.quoteSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Base debt
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {numberWithCommas(makerPositionInfo.baseDeleveraged)} {marketInfo?.baseSymbol}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Quote debt
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {numberWithCommas(makerPositionInfo.quoteDeleveraged)} {marketInfo?.quoteSymbol}
                    </Text>
                </Box>
            </SimpleGrid>
            {/* <Divider orientation="horizontal" />
            <Flex direction="row" width="100%" justifyContent="space-between">
                <VStack pr="6" flexGrow={2}>
                    <Box width="100%">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="xs" color="gray.500">
                                Base APR{" "}
                                <Popover trigger="hover">
                                    <PopoverTrigger>
                                        <QuestionOutlineIcon></QuestionOutlineIcon>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverBody>The est. APR from trading fees</PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Text>
                            <Text fontSize="sm" color="green.400" fontWeight="bold" lineHeight="1.6">
                                -%
                            </Text>
                        </HStack>
                    </Box>
                    <Box width="100%">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="xs" color="gray.500">
                                Rewards APR{" "}
                                <Popover trigger="hover">
                                    <PopoverTrigger>
                                        <QuestionOutlineIcon></QuestionOutlineIcon>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                        <PopoverBody>The est. APR from liquidity mining rewards</PopoverBody>
                                    </PopoverContent>
                                </Popover>
                            </Text>
                            <Text fontSize="sm" color="green.400" fontWeight="bold" lineHeight="1.4">
                                -
                            </Text>
                        </HStack>
                    </Box>
                </VStack>
                <Center height="50px">
                    <Divider orientation="vertical" />
                </Center>
                <VStack pl="6" flexGrow={2}>
                    <Box width="100%">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="xs" color="gray.500">
                                Margin Ratio
                            </Text>
                            <Text fontSize="sm" color="green.400" fontWeight="bold" lineHeight="1.6">
                                -
                            </Text>
                        </HStack>
                    </Box>
                    <Box width="100%">
                        <HStack justifyContent="space-between" alignItems="center">
                            <Text fontSize="xs" color="gray.500">
                                Account Leverage
                            </Text>
                            <Text fontSize="sm" fontWeight="bold" lineHeight="1.4" color="red.400">
                                -
                            </Text>
                        </HStack>
                    </Box>
                </VStack>
            </Flex>
            <Divider orientation="horizontal" /> */}
        </BorderFramePanel>
    )
}

export default YourLiquidity
