import { Divider, VStack, Text, NumberInput, InputGroup, NumberInputField, FormControl } from "@chakra-ui/react"
import Slippage from "./Slippage"
import React, { useCallback, useEffect, useState, useMemo } from "react"
import { Modal as ModalContainer } from "container/modal"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { MinusIcon } from "@chakra-ui/icons"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { formatInput, numberWithCommas } from "../../util/format"
import { Trade } from "../../container/perpetual/trade"
import Big from "big.js"
import { INPUT_PRECISION } from "../../constant"
import SmallFormLabel from "../base/SmallFormLabel"
import Modal from "component/base/Modal"
import Button from "component/base/Button"

function RemoveLiquidityModal() {
    const {
        removeLiquidityModalIsOpen,
        actions: { toggleRemoveLiquidityModal },
    } = ModalContainer.useContainer()

    const { currentMyMakerInfo, removeLiquidity } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const { slippage } = Trade.useContainer()
    const [liquidity, setLiquidity] = useState<string>("0")

    const isEnabled = useMemo<boolean>(() => {
        if (!currentMyMakerInfo) return false
        let liq
        try {
            liq = Big(liquidity)
        } catch (err) {
            console.log(err)
            return false
        }
        if (liq.gt(currentMyMakerInfo.liquidity)) return false
        return true
    }, [currentMyMakerInfo, liquidity])

    const handleRemoveLiquidity = useCallback(() => {
        const liq = Big(liquidity)
        const poolInfo = currentMarketState.poolInfo
        const base = liq.mul(poolInfo.base).div(poolInfo.totalLiquidity)
        const quote = liq.mul(poolInfo.quote).div(poolInfo.totalLiquidity)

        removeLiquidity(liq, base.mul(1.0 - slippage / 100), quote.mul(1.0 - slippage / 100))
    }, [liquidity, currentMarketState?.poolInfo, removeLiquidity, slippage])

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, INPUT_PRECISION)
                setLiquidity(formattedValue)
            }
        },
        [setLiquidity],
    )

    // Reset values when market is updated
    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setLiquidity("0")
        }
    }, [currentMarketState.baseSymbol])

    return (
        <Modal
            headerText="Remove Liquidity"
            isOpen={removeLiquidityModalIsOpen}
            onClose={toggleRemoveLiquidityModal}
            size="md"
            body={
                <VStack spacing={5}>
                    <Text align="center" fontSize="medium" fontWeight="bold" lineHeight="1.4">
                        Mark Price: {numberWithCommas(currentMarketState.markPriceDisplay)}
                        {currentMarketState.baseSymbolDisplay}/{currentMarketState.quoteSymbolDisplay}
                    </Text>
                    <FormControl id="margin">
                        <SmallFormLabel>Liquidity</SmallFormLabel>
                        <NumberInput value={liquidity} onInput={handleOnInput}>
                            <InputGroup>
                                <NumberInputField />
                            </InputGroup>
                        </NumberInput>
                    </FormControl>
                    <Text>Liquidity {numberWithCommas(currentMyMakerInfo?.liquidity)}</Text>
                    <Divider />
                    <Slippage />
                    <Divider />
                </VStack>
            }
            fotter={
                <Button
                    text="Remove Liquidity"
                    customType="base-blue"
                    onClick={handleRemoveLiquidity}
                    leftIcon={<MinusIcon />}
                    isDisabled={!isEnabled}
                />
            }
        />
    )
}

export default RemoveLiquidityModal
