import { FormControl, Wrap, WrapItem, Button, Text } from "@chakra-ui/react"
import { useCallback, useMemo } from "react"

import Big from "big.js"
import { bigNum2Big } from "util/format"
import { BigNumber } from "ethers"

interface SubmitBuySellState {
    baseOrderValue: Big
    quoteOrderValue: Big
    quoteSymbol: string
    slippage: number
    isLoading: boolean
    isDisabled: boolean
    trade: (isLong: boolean, amount: Big, slippage: number) => void
    previewTrade: (isLong: boolean, amount: Big, slippage: number) => Promise<BigNumber | undefined>
}

function SubmitBuySell({
    baseOrderValue,
    quoteOrderValue,
    quoteSymbol,
    slippage,
    isLoading,
    isDisabled,
    trade,
    previewTrade,
}: SubmitBuySellState) {
    const handleOnTrade = useCallback(
        async (isBuy: boolean) => {
            if (baseOrderValue) {
                const results = await previewTrade(isBuy, baseOrderValue, slippage)

                if (results) {
                    console.log("oppositeAmount", bigNum2Big(results).toString())
                }

                await trade(isBuy, baseOrderValue, slippage)
            }
        },
        [baseOrderValue, previewTrade, quoteOrderValue, slippage, trade],
    )

    const handleBuyTrade = useCallback(() => handleOnTrade(true), [handleOnTrade])
    const hanledSellTrade = useCallback(() => handleOnTrade(false), [handleOnTrade])

    return useMemo(
        () => (
            <FormControl id="margin">
                <Text align="center" fontSize="medium" fontWeight="bold" lineHeight="1.4" mb="8">
                    Order value: {quoteOrderValue.toString()} {quoteSymbol}
                </Text>
                <Wrap justify="space-between">
                    <WrapItem w="45%">
                        <Button
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            size="md"
                            colorScheme="green"
                            onClick={handleBuyTrade}
                            width="100%"
                        >
                            Buy
                        </Button>
                    </WrapItem>
                    <WrapItem w="45%">
                        <Button
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            size="md"
                            colorScheme="red"
                            onClick={hanledSellTrade}
                            width="100%"
                        >
                            Sell
                        </Button>
                    </WrapItem>
                </Wrap>
            </FormControl>
        ),
        [handleBuyTrade, hanledSellTrade, isDisabled, isLoading, quoteOrderValue, quoteSymbol],
    )
}

export default SubmitBuySell
