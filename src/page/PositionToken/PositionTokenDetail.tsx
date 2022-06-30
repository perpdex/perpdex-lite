import React, { useCallback, useState } from "react"
import {
    VStack,
    Flex,
    Box,
    HStack,
    SimpleGrid,
    Button,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    Text,
} from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import { useParams } from "react-router-dom"
import Big from "big.js"
import { BIG_ZERO, USDC_PRECISION } from "../../constant"
import { formatInput } from "../../util/format"

function PositionTokenDetail() {
    type Param = {
        marketAddress: string
    }
    const { marketAddress } = useParams<Param>()

    const { longTokenStates } = PerpdexLongTokenContainer.useContainer()
    const longTokenState = longTokenStates[marketAddress]

    const fromSymbol = longTokenState?.assetSymbol
    const toSymbol = longTokenState?.symbol
    const fromBalance = longTokenState?.myShares
    const toBalance = longTokenState?.myShares

    const [fromAmount, setFromAmount] = useState<string>("0")
    const [toAmount, setToAmount] = useState<string>("0")

    const handleOnFromInput = useCallback(
        e => {
            setFromAmount(e.target.value)
        },
        [setFromAmount, setToAmount, toAmount],
    )

    const handleOnToInput = useCallback(
        e => {
            setToAmount(e.target.value)
        },
        [setFromAmount, setToAmount, fromAmount],
    )

    const handleOnProceed = useCallback(e => {}, [fromAmount, toAmount])

    return (
        <FrameContainer>
            <Flex width="100%">
                <VStack width="50%">
                    <Button colorScheme="pink">Mint</Button>
                    <Button colorScheme="pink">Redeem</Button>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
                        From
                        {fromSymbol}
                        {fromBalance?.toString()}
                        <NumberInput value={fromAmount} onInput={handleOnFromInput}>
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
                        To
                        {toSymbol}
                        {toBalance?.toString()}
                        <NumberInput value={toAmount} onInput={handleOnToInput}>
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                    <Button colorScheme="pink" onClick={handleOnProceed}>
                        Proceed
                    </Button>
                </VStack>
                <VStack width="50%">
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
                        Token Info Symbol {longTokenState?.symbol}
                        Name {longTokenState?.name}
                        Input Token {longTokenState?.assetSymbol}
                        Total Supply {longTokenState?.totalSupply?.toString()}
                        TODO: TVL {longTokenState?.totalAssets?.toString()} {longTokenState?.assetSymbol}
                        TVL(USD) $ {longTokenState?.totalAssets?.toString()}
                        Address {marketAddress}
                    </Box>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
                        Order History TODO:
                    </Box>
                </VStack>
            </Flex>
        </FrameContainer>
    )
}

export default PositionTokenDetail
