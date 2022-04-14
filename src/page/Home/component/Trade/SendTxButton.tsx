import { Amm } from "container/amm"
import Big from "big.js"
import { Button } from "@chakra-ui/react"
import { ClearingHouse } from "container/clearingHouse"
import { Side } from "constant"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { isAddress } from "ethers/lib/utils"
import { useCallback } from "react"
import { usePositionSize } from "./usePositionSize"

function SendTxButton() {
    const { selectedAmm } = Amm.useContainer()
    const { slippage, side, collateral } = Trade.useContainer()
    const { openPosition } = ClearingHouse.useContainer()
    const { isLoading: isTxExecuting } = Transaction.useContainer()
    const { positionSize, isCalculating } = usePositionSize()
    const ammAddress = selectedAmm?.address || ""

    const isDisabled = isTxExecuting || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral && isAddress(ammAddress)) {
            const _positionSize = new Big(positionSize)
            const _slippage = slippage / 100
            const quoteAmountBound: Big =
                side === Side.Long ? collateral.mul(1 + _slippage) : collateral.mul(1 - _slippage)

            openPosition(ammAddress, side, _positionSize, quoteAmountBound)
        }
    }, [ammAddress, collateral, openPosition, positionSize, side, slippage])

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
