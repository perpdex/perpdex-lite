import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import SendTxButton from "./SendTxButton"
import TxInfoTable from "./TxInfoTable"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { useCallback } from "react"
import { usePositionSize } from "../usePositionSize"
import { bigNum2Big } from "util/format"
import { PerpdexExchangeContainer } from "container/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import Big from "big.js"

function Summary() {
    const {
        state: { markPrice },
    } = PerpdexMarketContainer.useContainer()
    const { slippage, isBaseToQuote, collateral, leverage } = Trade.useContainer()
    const { trade, preview } = PerpdexExchangeContainer.useContainer()
    const { isLoading } = Transaction.useContainer()
    const { positionSize, isCalculating } = usePositionSize()

    // const { size: openedSize, margin: openedMargin, unrealizedPnl, outputPrice } = useOpenedPositionSize("")

    // /* prepare data for UI */
    // const entryPrice: Big | null = useMemo(() => {
    //     if (!isCalculating && positionSize !== "" && collateral !== null) {
    //         const b_positionSize = new Big(positionSize)
    //         if (b_positionSize.eq(0) || collateral.mul(leverage).eq(0)) {
    //             return null
    //         }
    //         return collateral.mul(leverage).div(b_positionSize)
    //     }
    //     return null
    // }, [collateral, isCalculating, leverage, positionSize])

    const isDisabled = isLoading || isCalculating || collateral === null || collateral.eq(0)

    const handleOnTrade = useCallback(async () => {
        if (collateral) {
            const results = await preview.trade(isBaseToQuote, collateral, slippage)

            if (results) {
                console.log("oppositeAmount", bigNum2Big(results, 18).toString())
            }

            trade(isBaseToQuote, collateral, slippage)
        }
    }, [collateral, isBaseToQuote, trade, preview, slippage])

    return (
        <>
            <Heading w="full" size="md">
                Transaction Summary
            </Heading>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px">
                <TxInfoTable markPrice={markPrice} priceImpact="" estimateGasFee={Big(0)} fundingRatio="" />
            </Box>
            <VStack spacing={2} width="full">
                <SendTxButton isDisabled={isDisabled} isLoading={isLoading} handleOnClick={handleOnTrade} />
                <Text fontSize="sm" color="gray.500">
                    Confirm in Metamask
                </Text>
            </VStack>
        </>
    )
}

export default Summary
