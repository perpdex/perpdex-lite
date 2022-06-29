import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    SimpleGrid,
    StackDivider,
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
        <HStack justifyContent="space-evenly" divider={<StackDivider borderColor="#627EEA" />}>
            <VStack>
                <Box
                    w="100%"
                    bgGradient="linear(180deg, rgba(98, 126, 234, 0.5) 0%, rgba(249, 0, 119, 0.5) 100%);"
                    borderRadius={20}
                    p={59}
                >
                    <VStack spacing={28} alignItems="stretch">
                        <HStack w="100%" justifyContent="space-between" alignItems="center">
                            <LogoWhite></LogoWhite>
                            <Box></Box>
                        </HStack>
                        <HStack w="100%" justifyContent="space-between" alignItems="center">
                            <Box>
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
                            </Box>

                            <Box>
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
                                        color="white"
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
            <VStack>
                <HStack w="100%" justifyContent="space-evenly">
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
                <Box borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6}>
                    <Text>Open Positions</Text>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th border="0px">Assets</Th>
                                <Th border="0px">Profit/Loss</Th>
                                <Th border="0px">Position</Th>
                                <Th border="0px">Avg. Open Price</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            <Tr>
                                <Td border="0px">0.0234 BTC</Td>
                                <Td border="0px">+2.34</Td>
                                <Td border="0px">
                                    <Button mb={[4, 0]} bgColor="#353E80" borderRadius="10px" color="white">
                                        Trade
                                    </Button>
                                </Td>
                                <Td border="0px">$2,333.57</Td>
                            </Tr>
                        </Tbody>
                    </Table>
                </Box>
            </VStack>
        </HStack>
    )
}

export default AccountPanel
