import { Box, Flex, HStack, SimpleGrid, Text, VStack } from "@chakra-ui/react"
import { CircleIcon, EthIconBlack, LogoBlack, LogoWhite, PerpCoin } from "../Icon"
import Big from "big.js"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"

function AccountPanel() {
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const quoteSymbol = currentMarketState.quoteSymbol
    const totalAccountValue = currentMyAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(currentMarketState.indexPriceQuote)
    const collateralBalance = currentMyAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(currentMarketState.indexPriceQuote)

    return (
        <Box bgColor={"#D9D9D9"} borderRadius={20} padding={59}>
            <VStack spacing={28} alignItems="stretch">
                <HStack w="100%" justifyContent="space-between" alignItems="center">
                    <LogoBlack></LogoBlack>
                    <Box></Box>
                </HStack>
                <HStack w="100%" justifyContent="space-between" alignItems="center">
                    <Box>
                        <HStack>
                            <CircleIcon boxSize={12} color="blackAlpha.300" />
                            <VStack spacing={0}>
                                <Text fontSize="xs" color="black">
                                    Net USD Value
                                </Text>
                                <HStack w="100%" justifyContent="start">
                                    <Text as="span" color="black" fontSize="xl" fontWeight="bold">
                                        {totalAccountValue?.toFixed()} {quoteSymbol}
                                    </Text>
                                    <Text as="span" color="black" fontSize="xl" marginLeft={2}>
                                        (${totalAccountValueUsd?.toFixed()})
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>

                    <Box>
                        <HStack>
                            <CircleIcon boxSize={12} color="blackAlpha.300" />
                            <VStack spacing={0}>
                                <Text fontSize="xs" color="black">
                                    Free Collateral
                                </Text>
                                <HStack w="100%" justifyContent="start">
                                    <Text as="span" color="black" fontSize="xl" fontWeight="bold">
                                        {collateralBalance?.toFixed()} {quoteSymbol}
                                    </Text>
                                    <Text as="span" color="black" fontSize="xl" marginLeft={2}>
                                        (${collateralBalanceUsd?.toFixed()})
                                    </Text>
                                </HStack>
                            </VStack>
                        </HStack>
                    </Box>
                </HStack>
                <HStack w="100%" justifyContent="space-between" alignItems="center">
                    <Box></Box>
                    <EthIconBlack></EthIconBlack>
                </HStack>
            </VStack>
        </Box>
    )
}

export default AccountPanel
