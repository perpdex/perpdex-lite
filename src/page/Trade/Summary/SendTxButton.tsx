import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import Big from "big.js"
import { Button } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/perpdexExchangeContainer"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { useCallback } from "react"
import { usePositionSize } from "../usePositionSize"
import { big2BigNum } from "util/format"
import { Connection } from "container/connection"

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
        state: { currentMarketInfo, markPrice },
    } = PerpdexMarketContainer.useContainer()
    const { slippage, isBaseToQuote, collateral } = Trade.useContainer()
    const { openPosition } = PerpdexExchangeContainer.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { isCalculating } = usePositionSize()
    const { account } = Connection.useContainer()

    const isDisabled = isTxExecuting || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral && currentMarketInfo && markPrice && account) {
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

            // const results = await contractExecuter?.contract.callStatic.openPosition({
            //     trader: account,
            //     market: currentMarket.baseAddress,
            //     isBaseToQuote,
            //     isExactInput,
            //     amount: big2BigNum(positions.basePosition),
            //     oppositeAmountBound: big2BigNum(oppositeAmountBount),
            //     deadline: BigNumber.from(2).pow(96)
            // })

            // if (results?.base && results?.quote) {
            //     console.log(bigNum2Big(results?.base, 18).toString(), bigNum2Big(results?.quote, 18).toString())
            // }

            openPosition(
                isBaseToQuote,
                isExactInput,
                big2BigNum(positions.basePosition),
                big2BigNum(oppositeAmountBount),
            )
        }
    }, [account, collateral, currentMarketInfo, isBaseToQuote, markPrice, openPosition, slippage])

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
