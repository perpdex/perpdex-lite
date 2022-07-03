import React, { useCallback, useState } from "react"
import {
    VStack,
    Flex,
    Box,
    Button,
    NumberInput,
    NumberInputField,
    ButtonGroup,
    Text,
    Grid,
    GridItem,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    HStack,
} from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import { useParams } from "react-router-dom"
import Big from "big.js"

function PositionTokenDetail() {
    type Param = {
        marketAddress: string
    }
    const { marketAddress } = useParams<Param>()

    const { longTokenStates, deposit, redeem } = PerpdexLongTokenContainer.useContainer()
    const longTokenState = longTokenStates[marketAddress]

    const [fromAmount, setFromAmount] = useState<string>("0")
    const [toAmount, setToAmount] = useState<string>("0")
    const [isRedeem, setIsRedeem] = useState<boolean>(false)

    const fromSymbol = longTokenState?.assetSymbol
    const toSymbol = longTokenState?.symbol
    const fromBalance = longTokenState?.myShares
    const toBalance = longTokenState?.myShares

    const handleOnFromInput = useCallback(
        e => {
            setFromAmount(e.target.value)
        },
        [setFromAmount],
    )

    const handleOnToInput = useCallback(
        e => {
            setToAmount(e.target.value)
        },
        [setToAmount],
    )

    const handleOnProceed = useCallback(
        e => {
            if (!marketAddress) return

            if (isRedeem) {
                redeem(marketAddress, Big(toAmount))
            } else {
                deposit(marketAddress, Big(fromAmount))
            }
        },
        [isRedeem, fromAmount, toAmount, marketAddress, deposit, redeem],
    )

    return (
        <FrameContainer>
            <Flex direction={{ base: "column", lg: "row" }} width="100%">
                <VStack flex="50" spacing={10}>
                    <ButtonGroup spacing="6">
                        <Button
                            color="white"
                            bgColor="#353E80"
                            borderRadius="10px"
                            onClick={() => {
                                setIsRedeem(false)
                            }}
                        >
                            Mint
                        </Button>
                        <Button
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                setIsRedeem(true)
                            }}
                        >
                            Redeem
                        </Button>
                    </ButtonGroup>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20} w="80%" p={8}>
                        <HStack justifyContent={"space-between"}>
                            <Text>From</Text>
                            <Text>
                                {isRedeem ? toSymbol : fromSymbol}: {(isRedeem ? toBalance : fromBalance)?.toString()}
                            </Text>
                        </HStack>
                        <NumberInput
                            value={isRedeem ? toAmount : fromAmount}
                            onInput={isRedeem ? handleOnToInput : handleOnFromInput}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20} w="80%" p={8}>
                        <HStack justifyContent={"space-between"}>
                            <Text>To</Text>
                            <Text>
                                {isRedeem ? fromSymbol : toSymbol}: {(isRedeem ? fromBalance : toBalance)?.toString()}
                            </Text>
                        </HStack>
                        <NumberInput
                            value={isRedeem ? fromAmount : toAmount}
                            onInput={isRedeem ? handleOnFromInput : handleOnToInput}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                    <Button
                        size="lg"
                        w="60%"
                        color="white"
                        bgColor="#353E80"
                        borderRadius="10px"
                        onClick={handleOnProceed}
                        mb="30px"
                    >
                        Proceed
                    </Button>
                </VStack>
                <VStack flex="50" spacing={10}>
                    <Grid
                        templateColumns="repeat(2, 1fr)"
                        bgGradient="linear(to-b, #627EEA80, #F9007780)"
                        borderRadius={20}
                        p={10}
                        gap={2}
                    >
                        <GridItem colSpan={2}>
                            <Text fontSize="xl">Token Info</Text>
                        </GridItem>
                        <Text>Token Info Symbol</Text>
                        <Text align="end">{longTokenState?.symbol}</Text>
                        <Text>Name</Text>
                        <Text align="end"> {longTokenState?.name}</Text>
                        <Text>Input Token</Text>
                        <Text align="end"> {longTokenState?.assetSymbol}</Text>
                        <Text>Total Supply</Text> <Text align="end">{longTokenState?.totalSupply?.toString()}</Text>
                        <Text>TODO:</Text>
                        <Text align="end">TODO:</Text>
                        <Text>TVL</Text>{" "}
                        <Text align="end">
                            {longTokenState?.totalAssets?.toString()} {longTokenState?.assetSymbol}
                        </Text>
                        <Text>TVL(USD)</Text>
                        <Text align="end">$ {longTokenState?.totalAssets?.toString()}</Text>
                        <Text>Address</Text>
                        <Text align="end" wordBreak="break-all">
                            {" "}
                            {longTokenState?.address}
                        </Text>
                    </Grid>
                    <Box
                        w="100%"
                        borderColor="#728BEC"
                        borderWidth={{ base: "0px", md: "1px" }}
                        borderRadius="10px"
                        p={6}
                        mx={{ base: "auto", md: "0" }}
                    >
                        <Text fontSize="xl">Order History</Text>
                        <Table variant="simple" overflowY="scroll">
                            <Thead>
                                <Tr>
                                    <Th border="0px" pl={0}>
                                        Price(USD)
                                    </Th>
                                    <Th border="0px">Size</Th>
                                    <Th border="0px">Time</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td border="0px" pl={0}>
                                        392.21
                                    </Td>
                                    <Td border="0px">1.2</Td>
                                    <Td border="0px">13:17:21</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Flex>
        </FrameContainer>
    )
}

export default PositionTokenDetail
