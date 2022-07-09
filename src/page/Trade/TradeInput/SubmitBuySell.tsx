import { FormControl, Wrap, WrapItem } from "@chakra-ui/react"
import { useCallback, useMemo } from "react"
import Button from "../../../component/base/Button"

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
                            customType="base-green"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            onClick={handleBuyTrade}
                            width="100%"
                            text="Buy/Long"
                        />
                    </WrapItem>
                    <WrapItem w="45%">
                        <Button
                            customType="outline-pink"
                            isDisabled={isDisabled}
                            isLoading={isLoading}
                            onClick={hanledSellTrade}
                            width="100%"
                            text="Sell/Short"
                        />
                    </WrapItem>
                </Wrap>
            </FormControl>
        ),
        [handleBuyTrade, hanledSellTrade, isDisabled, isLoading],
    )
}

export default SubmitBuySell
