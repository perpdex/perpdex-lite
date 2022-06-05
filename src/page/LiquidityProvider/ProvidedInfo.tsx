import { QuestionOutlineIcon } from "@chakra-ui/icons"
import {
    Text,
    Heading,
    SimpleGrid,
    Box,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    Divider,
    Center,
    VStack,
    Flex,
    HStack,
} from "@chakra-ui/react"
import { useCallback, useEffect, useState } from "react"
import { bigNum2Big } from "../../util/format"
import { useInterval } from "@chakra-ui/hooks"
import { Connection } from "../../container/connection"
import { PerpdexMarketContainer } from "../../container/perpdexMarketContainer"
import { Contract } from "../../container/contract"
import Big from "big.js"

export interface MakerPositionInfo {
    unrealizedPnl: Big
    liquidityValue: Big
    baseAmount: Big
    quoteAmount: Big
    baseDebt: Big
    quoteDebt: Big
}

function ProvidedInfoTable() {
    const { account } = Connection.useContainer()
    const { perpdexExchange } = Contract.useContainer()
    const {
        state: { currentMarket },
    } = PerpdexMarketContainer.useContainer()
    const [makerPositionInfo, setMakerPositionInfo] = useState<MakerPositionInfo>({
        unrealizedPnl: Big(0),
        liquidityValue: Big(0),
        baseAmount: Big(0),
        quoteAmount: Big(0),
        baseDebt: Big(0),
        quoteDebt: Big(0),
    })

    const getMakerPositionInfo = useCallback(async () => {
        if (!account) return
        if (!perpdexExchange) return

        const price = Big(0) // FIX

        // FIX
        const tmp = await perpdexExchange.getTotalAccountValue(account)

        // const [quoteAmountRaw, quotePendingFee] = await orderBook.getTotalTokenAmountInPoolAndPendingFee(
        //     account,
        //     baseTokenAddress,
        //     false,
        // )
        // const [baseAmountRaw, basePendingFee] = await orderBook.getTotalTokenAmountInPoolAndPendingFee(
        //     account,
        //     baseTokenAddress,
        //     true,
        // )
        // const quoteDebtRaw = await orderBook.getTotalOrderDebt(account, baseTokenAddress, false)
        // const baseDebtRaw = await orderBook.getTotalOrderDebt(account, baseTokenAddress, true)

        const baseAmount = bigNum2Big(tmp)
        const quoteAmount = bigNum2Big(tmp)
        const baseDebt = bigNum2Big(tmp)
        const quoteDebt = bigNum2Big(tmp)

        const info = {
            liquidityValue: baseAmount.mul(price).add(quoteAmount),
            unrealizedPnl: baseAmount.sub(baseDebt).mul(price).add(quoteAmount.sub(quoteDebt)),
            baseAmount: baseAmount,
            quoteAmount: quoteAmount,
            baseDebt: baseDebt,
            quoteDebt: quoteDebt,
        }

        setMakerPositionInfo(info)
    }, [account, perpdexExchange])

    useEffect(() => {
        getMakerPositionInfo()
    }, [getMakerPositionInfo])

    useInterval(getMakerPositionInfo, 5000)

    return (
        <>
            <Heading w="full" size="sm">
                Provided Liquidity
            </Heading>
            <SimpleGrid width="100%" columns={2} spacing={6}>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Total Liquidity
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {makerPositionInfo.liquidityValue.eq(0) ? "-" : makerPositionInfo.liquidityValue.toFixed(6)}{" "}
                        {currentMarket}
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
                        {makerPositionInfo.liquidityValue.eq(0) ? "-" : makerPositionInfo.unrealizedPnl.toFixed(6)}{" "}
                        {currentMarket}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Base assets
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {makerPositionInfo.liquidityValue.eq(0) ? "-" : makerPositionInfo.baseAmount.toFixed(6)}{" "}
                        {currentMarket}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Quote assets
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {makerPositionInfo.liquidityValue.eq(0) ? "-" : makerPositionInfo.quoteAmount.toFixed(6)}{" "}
                        {currentMarket}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Base debt
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {makerPositionInfo.liquidityValue.eq(0) ? "-" : makerPositionInfo.baseDebt.toFixed(6)}{" "}
                        {currentMarket}
                    </Text>
                </Box>
                <Box>
                    <Text fontSize="xs" color="gray.500">
                        Quote debt
                    </Text>
                    <Text fontSize="xl" fontWeight="bold" lineHeight="1.4">
                        {makerPositionInfo.liquidityValue.eq(0) ? "-" : makerPositionInfo.quoteDebt.toFixed(6)}{" "}
                        {currentMarket}
                    </Text>
                </Box>
            </SimpleGrid>
            <Divider orientation="horizontal" />
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
            <Divider orientation="horizontal" />
        </>
    )
}

export default ProvidedInfoTable
