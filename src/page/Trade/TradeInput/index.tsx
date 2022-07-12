import React, { useCallback, useEffect, useMemo, useState } from "react"
import Big from "big.js"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import PositionInput from "./PositionInput"
import { BIG_ZERO } from "constant"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Box, VStack } from "@chakra-ui/react"
import SideSwitcher from "component/base/SideSwitcher"
import Button from "component/base/Button"
import Summary from "./Summary"
import Slippage from "./Slippage"
import { bigNum2Big } from "util/format"

function TradeInput() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { trade, preview, currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const [isBuy, setIsBuy] = useState<boolean>(true)
    const { isLoading } = Transaction.useContainer()
    const [baseOrderValue, setBaseOrderValue] = useState<Big>(BIG_ZERO)
    const [slippage, setSlippage] = useState<number>(0.5)

    // TODO: apply correct values
    const maxCollateral = useMemo(
        () =>
            currentMyAccountInfo && currentMyAccountInfo.collateralBalance
                ? currentMyAccountInfo.collateralBalance.mul(10)
                : BIG_ZERO,
        [currentMyAccountInfo],
    )

    const handleBasePositionInput = useCallback((value: Big | null) => {
        if (value !== null) {
            setBaseOrderValue(value)
        }
    }, [])

    const doSwitchToBuy = (val: boolean) => {
        setIsBuy(val)
    }

    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setBaseOrderValue(BIG_ZERO)
        }
    }, [currentMarketState.baseSymbol])

    const isSubmitDisabled = useMemo(() => {
        return baseOrderValue.eq(0) || isLoading
    }, [baseOrderValue, isLoading])

    const handleSubmit = useCallback(async () => {
        if (baseOrderValue) {
            const results = await preview.trade(isBuy, baseOrderValue, slippage)

            if (results) {
                console.log("oppositeAmount", bigNum2Big(results).toString())
            }

            await trade(isBuy, baseOrderValue, slippage)
        }
    }, [baseOrderValue, isBuy, preview, slippage, trade])

    return (
        <>
            <Box background="#181B41" borderRadius="10px" p={6}>
                <VStack spacing={6}>
                    <SideSwitcher isBuy={isBuy} doSwitchToBuy={doSwitchToBuy} />
                    <PositionInput
                        baseSymbol={currentMarketState.baseSymbolDisplay}
                        quoteSymbol={currentMarketState.quoteSymbolDisplay}
                        baseOrderValue={baseOrderValue}
                        markPrice={currentMarketState.markPrice}
                        maxCollateral={maxCollateral}
                        handleBasePositionInput={handleBasePositionInput}
                    />
                </VStack>
            </Box>
            <Box background="#181B41" borderRadius="10px" p={6} w="100%">
                <Summary />
            </Box>
            <Box background="#181B41" borderRadius="10px" p={6} w="100%">
                <Slippage slippage={slippage} setSlippage={setSlippage} />
            </Box>
            <Button
                text="Confirm Transaction"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                color="white"
                bgColor="#353E80"
                borderRadius="10px"
            />
        </>
    )
}

export default TradeInput
