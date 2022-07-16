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
import _ from "lodash"

interface PreviewResult {
    error: string
    oppositeAmount: Big
}

function TradeInput() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { trade, preview, currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const [isBuy, setIsBuy] = useState<boolean>(true)
    const { isLoading } = Transaction.useContainer()
    const [baseOrderValue, setBaseOrderValue] = useState<Big>(BIG_ZERO)
    const [slippage, setSlippage] = useState<number>(2)
    const [previewResult, setPreviewResult] = useState<PreviewResult>({
        error: "",
        oppositeAmount: Big(0),
    })

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
            updatePreview()
        }
    }, [])

    const doSwitchToBuy = (val: boolean) => {
        setIsBuy(val)
        updatePreview()
    }

    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setBaseOrderValue(BIG_ZERO)
        }
    }, [currentMarketState.baseSymbol])

    const isSubmitDisabled = useMemo(() => {
        return baseOrderValue.eq(0) || isLoading || !!previewResult.error
    }, [baseOrderValue, isLoading, previewResult?.error])

    const updatePreview = useCallback(async () => {
        console.log("updatePreview")
        const results = await preview.trade(isBuy, baseOrderValue, slippage)
        console.log(results)
        if (!results) return
        if (_.isString(results)) {
            setPreviewResult({
                error: results,
                oppositeAmount: Big(0),
            })
        } else {
            setPreviewResult({
                error: "",
                oppositeAmount: bigNum2Big(results),
            })
        }
    }, [setPreviewResult, preview, isBuy, baseOrderValue, slippage])

    const handleSubmit = useCallback(async () => {
        if (baseOrderValue) {
            await trade(isBuy, baseOrderValue, slippage)
        }
    }, [baseOrderValue, isBuy, preview, slippage, trade])

    return (
        <>
            <Box background="#181B41" borderRadius="10px" p={6}>
                <VStack spacing={6}>
                    <SideSwitcher
                        isBuy={isBuy}
                        longText="Buy/Long"
                        shortText="Sell/Short"
                        doSwitchToBuy={doSwitchToBuy}
                    />
                    <PositionInput
                        baseSymbol={currentMarketState.baseSymbolDisplay}
                        quoteSymbol={currentMarketState.quoteSymbolDisplay}
                        baseOrderValue={baseOrderValue}
                        markPrice={currentMarketState.markPrice}
                        maxCollateral={maxCollateral}
                        handleBasePositionInput={handleBasePositionInput}
                    />
                    <Slippage slippage={slippage} setSlippage={setSlippage} />
                    <Summary
                        error={previewResult.error}
                        baseAmount={baseOrderValue}
                        quoteAmount={previewResult.oppositeAmount}
                    />
                </VStack>
            </Box>
            <Button
                text="Confirm Transaction"
                onClick={handleSubmit}
                isLoading={isLoading}
                isDisabled={isSubmitDisabled}
                customType="base-blue"
            />
        </>
    )
}

export default TradeInput
