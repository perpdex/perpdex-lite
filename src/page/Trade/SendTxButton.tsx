import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import Big from "big.js"
import { Button } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/perpdexExchangeContainer"
import { Side } from "constant"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { useCallback } from "react"
import { usePositionSize } from "./usePositionSize"

function SendTxButton() {
    const {
        state: { currentMarket },
    } = PerpdexMarketContainer.useContainer()
    const { slippage, side, collateral } = Trade.useContainer()
    const { openPosition } = PerpdexExchangeContainer.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { positionSize, isCalculating } = usePositionSize()

    const isDisabled = isTxExecuting || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral && currentMarket) {
            const _positionSize = new Big(positionSize)
            const _slippage = slippage / 100
            const quoteAmountBound: Big =
                side === Side.Long ? collateral.mul(1 + _slippage) : collateral.mul(1 - _slippage)

            openPosition(currentMarket.baseAddress, side, _positionSize, quoteAmountBound)
        }
    }, [collateral, currentMarket, openPosition, positionSize, side, slippage])

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
