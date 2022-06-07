import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import Big from "big.js"
import { Button } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/perpdexExchangeContainer"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { useCallback } from "react"
import { usePositionSize } from "../usePositionSize"
import { big2BigNum } from "util/format"

function SendTxButton() {
    const {
        state: { currentMarket },
    } = PerpdexMarketContainer.useContainer()
    const { slippage, isBaseToQuote, collateral } = Trade.useContainer()
    const { openPosition } = PerpdexExchangeContainer.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { positionSize, isCalculating } = usePositionSize()

    const isDisabled = isTxExecuting || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral && currentMarket) {
            const isExactInput = true
            const amount = new Big(positionSize)

            const _slippage = slippage / 100
            const oppositeAmountBount = isBaseToQuote ? collateral.mul(1 + _slippage) : collateral.mul(1 - _slippage)

            console.log("openPosition", isBaseToQuote, isExactInput, big2BigNum(amount), oppositeAmountBount)

            openPosition(isBaseToQuote, isExactInput, big2BigNum(amount), big2BigNum(oppositeAmountBount))
        }
    }, [collateral, currentMarket, isBaseToQuote, openPosition, positionSize, slippage])

    return (
        <Button
            size="md"
            disabled={isDisabled}
            isLoading={isTxExecuting}
            isFullWidth
            colorScheme="blue"
            onClick={handleOnTrade}
        >
            Send Transaction
        </Button>
    )
}

export default SendTxButton
