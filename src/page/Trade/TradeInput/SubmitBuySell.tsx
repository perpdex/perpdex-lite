import { FormControl, Wrap, WrapItem, Button } from "@chakra-ui/react"
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
        [baseOrderValue, previewTrade, slippage, trade],
    )

    const handleBuyTrade = useCallback(() => handleOnTrade(true), [handleOnTrade])
    const hanledSellTrade = useCallback(() => handleOnTrade(false), [handleOnTrade])

    return useMemo(
        () => (
            <FormControl id="margin">
                <Wrap justify="space-between">
                    <WrapItem w="45%">
                        <Button
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            size="md"
                            bg="#66BB74"
                            color="white"
                            onClick={handleBuyTrade}
                            width="100%"
                        >
                            Buy/Long
                        </Button>
                    </WrapItem>
                    <WrapItem w="45%">
                        <Button
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            size="md"
                            color="#F90077"
                            border="1px"
                            borderColor={"#F90077"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={hanledSellTrade}
                            width="100%"
                        >
                            Sell/Short
                        </Button>
                    </WrapItem>
                </Wrap>
            </FormControl>
        ),
        [handleBuyTrade, hanledSellTrade, isDisabled, isLoading],
    )
}

export default SubmitBuySell
