import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    SimpleGrid,
    styled,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react"
import { ETHIcon, LogoWhite, PerpCoin } from "../Icon"
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
        <VStack>
            <Box
                w="100%"
                bgGradient="linear(180deg, rgba(98, 126, 234, 0.5) 0%, rgba(249, 0, 119, 0.5) 100%);"
                borderRadius={20}
                padding={59}
            >
                <VStack spacing={28} alignItems="stretch">
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <LogoWhite></LogoWhite>
                        <Box></Box>
                    </HStack>
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <Box>
                            <HStack>
                                <VStack spacing={0}>
                                    <Text fontSize="xs">Net USD Value</Text>
                                    <HStack w="100%" justifyContent="start">
                                        <Text as="span" fontSize="xl" fontWeight="bold">
                                            {totalAccountValue?.toFixed()} {quoteSymbol}
                                        </Text>
                                        <Text as="span" fontSize="xl" marginLeft={2}>
                                            (${totalAccountValueUsd?.toFixed()})
                                        </Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Box>

                        <Box>
                            <HStack>
                                <VStack spacing={0}>
                                    <Text fontSize="xs">Free Collateral</Text>
                                    <HStack w="100%" justifyContent="start">
                                        <Text as="span" fontSize="xl" fontWeight="bold">
                                            {collateralBalance?.toFixed()} {quoteSymbol}
                                        </Text>
                                        <Text as="span" fontSize="xl" marginLeft={2}>
                                            (${collateralBalanceUsd?.toFixed()})
                                        </Text>
                                    </HStack>
                                </VStack>
                            </HStack>
                        </Box>
                    </HStack>
                    <HStack w="100%" justifyContent="space-between" alignItems="center">
                        <Box></Box>
                        <ETHIcon boxSize={12}></ETHIcon>
                    </HStack>
                </VStack>
            </Box>
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th border="0px">COIN</Th>
                        <Th border="0px">WALLET</Th>
                        <Th border="0px">AMOUNT</Th>
                        <Th border="0px">AVAILABLE</Th>
                        <Th border="0px">ACTION</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td border="0px">
                            <ETHIcon boxSize={6}></ETHIcon>ETH/wETH
                        </Td>
                        <Td border="0px">20</Td>
                        <Td border="0px">1.2($35,140)</Td>
                        <Td border="0px">1.1($32,210)</Td>
                        <Td border="0px">
                            <ButtonGroup spacing="6">
                                <Button mb={[4, 0]} bgColor="#D9D9D9" borderRadius="10px">
                                    Deposit
                                </Button>
                                <Button
                                    mb={[4, 0]}
                                    color="#FFFFFF"
                                    border="1px"
                                    borderColor={"#D9D9D9"}
                                    borderRadius="10px"
                                    variant="solid"
                                >
                                    Withdraw
                                </Button>
                            </ButtonGroup>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </VStack>
    )
}

export default AccountPanel
