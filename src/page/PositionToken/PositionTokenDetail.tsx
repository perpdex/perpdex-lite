import React, { useCallback, useState } from "react"
import { VStack, Flex, Box, Button, NumberInput, NumberInputField } from "@chakra-ui/react"

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
            <Flex width="100%">
                <VStack width="50%">
                    <Button
                        colorScheme="pink"
                        onClick={() => {
                            setIsRedeem(false)
                        }}
                    >
                        Mint
                    </Button>
                    <Button
                        colorScheme="pink"
                        onClick={() => {
                            setIsRedeem(true)
                        }}
                    >
                        Redeem
                    </Button>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
                        From
                        {isRedeem ? toSymbol : fromSymbol}
                        {(isRedeem ? toBalance : fromBalance)?.toString()}
                        <NumberInput
                            value={isRedeem ? toAmount : fromAmount}
                            onInput={isRedeem ? handleOnToInput : handleOnFromInput}
                        >
                            <NumberInputField />
                        </NumberInput>
                    </Box>
                    <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
                        To
                        {isRedeem ? fromSymbol : toSymbol}
                        {(isRedeem ? fromBalance : toBalance)?.toString()}
                        <NumberInput
                            value={isRedeem ? fromAmount : toAmount}
                            onInput={isRedeem ? handleOnFromInput : handleOnToInput}
                        >
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
                        <br />
                        Name {longTokenState?.name}
                        <br />
                        Input Token {longTokenState?.assetSymbol}
                        <br />
                        Total Supply {longTokenState?.totalSupply?.toString()}
                        <br />
                        TODO:
                        <br />
                        TVL {longTokenState?.totalAssets?.toString()} {longTokenState?.assetSymbol}
                        <br />
                        TVL(USD) $ {longTokenState?.totalAssets?.toString()}
                        <br />
                        Address {longTokenState?.address}
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
