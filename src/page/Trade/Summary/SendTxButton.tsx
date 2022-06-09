import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import Big from "big.js"
import { Button } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/perpdexExchangeContainer"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { useCallback } from "react"
import { usePositionSize } from "../usePositionSize"
import { big2BigNum } from "util/format"

function calcPositionSize(isBaseToQuote: boolean, notional: Big, markPrice: Big) {
    const basePosition = isBaseToQuote ? notional.mul(markPrice) : notional
    const oppositPosition = isBaseToQuote ? notional : notional.mul(markPrice)
    return {
        basePosition,
        oppositPosition,
    }
}

function SendTxButton() {
    const {
        state: { currentMarket, markPrice },
    } = PerpdexMarketContainer.useContainer()
    const { slippage, isBaseToQuote, collateral } = Trade.useContainer()
    const { openPosition } = PerpdexExchangeContainer.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { isCalculating } = usePositionSize()

    const isDisabled = isTxExecuting || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral && currentMarket && markPrice) {
            const isExactInput = isBaseToQuote
            // const amount = new Big(positionSize)

            const positions = calcPositionSize(isBaseToQuote, collateral, markPrice)

            const _slippage = slippage / 100

            let oppositeAmountBount
            if (isExactInput) {
                oppositeAmountBount = positions.oppositPosition.mul(1 - _slippage)
            } else {
                oppositeAmountBount = positions.oppositPosition.mul(1 + _slippage)
            }

            console.log(
                "openPosition",
                isBaseToQuote,
                isExactInput,
                positions.basePosition.toString(),
                oppositeAmountBount.toString(),
            )

            openPosition(
                isBaseToQuote,
                isExactInput,
                big2BigNum(positions.basePosition),
                big2BigNum(oppositeAmountBount),
            )
        }
    }, [collateral, currentMarket, isBaseToQuote, markPrice, openPosition, slippage])

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
