import { Box, SimpleGrid, Text } from "@chakra-ui/react"
import { LogoWhite } from "../Icon"
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
        <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
            <SimpleGrid width="100%" columns={2} spacing={6} padding={59}>
                <LogoWhite></LogoWhite>
                <Box></Box>
                <Box>
                    <Text fontSize="xs" color="white">
                        Total Account Value
                    </Text>
                    <Text as="span" fontSize="xl" fontWeight="bold">
                        {totalAccountValue?.toFixed()} {quoteSymbol}
                    </Text>
                    <Text as="span" fontSize="xl" marginLeft={2}>
                        (${totalAccountValueUsd?.toFixed()})
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="white">
                        Collateral
                    </Text>
                    <Text as="span" fontSize="xl" fontWeight="bold">
                        {collateralBalance?.toFixed()} {quoteSymbol}
                    </Text>
                    <Text as="span" fontSize="xl" marginLeft={2}>
                        (${collateralBalanceUsd?.toFixed()})
                    </Text>
                </Box>
            </SimpleGrid>
        </Box>
    )
}

export default AccountPanel
