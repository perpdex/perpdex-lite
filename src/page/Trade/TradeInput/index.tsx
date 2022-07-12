import React, { useCallback, useEffect, useMemo, useState } from "react"
import Big from "big.js"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import PositionInput from "./PositionInput"
import { BIG_ZERO } from "constant"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import SubmitBuySell from "./SubmitBuySell"
import { Transaction } from "container/connection/transaction"
import { Box, VStack } from "@chakra-ui/react"

function TradeInput() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { trade, preview } = PerpdexExchangeContainer.useContainer()
    const { isLoading } = Transaction.useContainer()
    const [baseOrderValue, setBaseOrderValue] = useState<Big>(BIG_ZERO)
    const [slippage, setSlippage] = useState<number>(0.5)

    const baseSymbol = currentMarketState.baseSymbol
    const quoteSymbol = currentMarketState.quoteSymbol

    const handlePositionInput = useCallback((value: Big | null) => {
        if (value !== null) {
            setBaseOrderValue(value)
        }
    }, [])

    const quoteOrderValue = useMemo(() => {
        return baseOrderValue.mul(currentMarketState.markPrice)
    }, [baseOrderValue, currentMarketState.markPrice])

    const isSubmitDisabled = useMemo(() => {
        return baseOrderValue.eq(0) || isLoading
    }, [baseOrderValue, isLoading])

    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setBaseOrderValue(BIG_ZERO)
        }
    }, [currentMarketState.baseSymbol])

    return (
        <Box background="#181B41" borderRadius="10px" p={6}>
            <VStack spacing={6}>
                <SubmitBuySell
                    baseOrderValue={baseOrderValue}
                    quoteOrderValue={quoteOrderValue}
                    quoteSymbol={quoteSymbol}
                    slippage={slippage}
                    isLoading={isLoading}
                    isDisabled={isSubmitDisabled}
                    trade={trade}
                    previewTrade={preview.trade}
                />
                <PositionInput
                    baseSymbol={baseSymbol}
                    baseOrderValue={baseOrderValue}
                    handleInput={handlePositionInput}
                />
            </VStack>
        </Box>
    )
}

export default TradeInput
