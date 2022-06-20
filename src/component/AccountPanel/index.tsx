import { Box, SimpleGrid, Text } from "@chakra-ui/react"
import { LogoWhite } from "../Icon"
import Big from "big.js"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"

function AccountPanel() {
    const { currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()

    const totalAccountValue = currentMyAccountInfo?.totalAccountValue
    // TODO: create hook to estimate usd value
    const totalAccountValueUsd = Big(4.56)
    const collateralBalance = currentMyAccountInfo?.collateralBalance
    const collateralBalanceUsd = Big(45.67)

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
                        {totalAccountValue?.toFixed()}
                    </Text>
                    <Text as="span" fontSize="xl" marginLeft={2}>
                        ({totalAccountValueUsd?.toFixed()})
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="white">
                        Collateral
                    </Text>
                    <Text as="span" fontSize="xl" fontWeight="bold">
                        {collateralBalance?.toFixed()}
                    </Text>
                    <Text as="span" fontSize="xl" marginLeft={2}>
                        ({collateralBalanceUsd?.toFixed()})
                    </Text>
                </Box>
            </SimpleGrid>
        </Box>
    )
}

export default AccountPanel
