import { Box, HStack, Text, VStack } from "@chakra-ui/react"
import { CurrencyIcon, LogoWhite } from "../Icon"
import Big from "big.js"
import { AccountInfo, MarketState } from "../../constant/types"
import { numberWithCommas } from "../../util/format"

interface Props {
    marketState: MarketState
    myAccountInfo: AccountInfo
}

function AccountPanel(props: Props) {
    const currentMyAccountInfo = props.myAccountInfo
    const currentMarketState = props.marketState

    const quoteSymbol = currentMarketState.quoteSymbol
    const totalAccountValue = currentMyAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(currentMarketState.indexPriceQuote)
    const collateralBalance = currentMyAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(currentMarketState.indexPriceQuote)

    return (
        <Box
            w={{ base: "100%", lg: "90%" }}
            bgGradient="linear(180deg, rgba(98, 126, 234, 0.5) 0%, rgba(249, 0, 119, 0.5) 100%);"
            borderRadius={20}
            p={59}
            m={10}
        >
            <VStack spacing={28} alignItems="stretch">
                <HStack w="100%" justifyContent="space-between" alignItems="center">
                    <LogoWhite></LogoWhite>
                    <Box></Box>
                </HStack>
                <VStack spacing={8}>
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <Box>
                            <VStack spacing={0}>
                                <Text fontSize="xs">Net USD Value</Text>
                                <HStack w="100%" justifyContent="start">
                                    <Text as="span" fontSize="xl" fontWeight="bold">
                                        {numberWithCommas(totalAccountValue)}
                                        {quoteSymbol}
                                    </Text>
                                    <Text as="span" fontSize="xl" marginLeft={2}>
                                        (${numberWithCommas(totalAccountValueUsd)})
                                    </Text>
                                </HStack>
                            </VStack>
                        </Box>
                        <HStack spacing={12}>
                            <Box>
                                <VStack spacing={0}>
                                    <Text fontSize="xs">Free Collateral</Text>
                                    <HStack w="100%" justifyContent="start">
                                        <Text as="span" fontSize="xl" fontWeight="bold">
                                            {numberWithCommas(collateralBalance)}
                                            {quoteSymbol}
                                        </Text>
                                        <Text as="span" fontSize="xl" marginLeft={2}>
                                            (${numberWithCommas(collateralBalanceUsd)})
                                        </Text>
                                    </HStack>
                                </VStack>
                            </Box>
                            <Box></Box>
                        </HStack>
                    </HStack>
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <Box></Box>
                        <CurrencyIcon symbol={currentMarketState.quoteSymbol} boxSize={12}></CurrencyIcon>
                    </HStack>
                </VStack>
            </VStack>
        </Box>
    )
}

export default AccountPanel
