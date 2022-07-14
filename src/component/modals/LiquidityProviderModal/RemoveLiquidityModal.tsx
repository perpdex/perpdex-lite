import { VStack, Box } from "@chakra-ui/react"
import React, { useCallback, useEffect, useState, useMemo } from "react"
import { Modal as ModalContainer } from "container/modal"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Trade } from "../../../container/perpetual/trade"
import Big from "big.js"
import Modal from "component/base/Modal"
import Button from "component/base/Button"
import Summary from "./Summary"
import Withdraw from "./Withdraw"

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

    // Reset values when market is updated
    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setLiquidity("0")
        }
    }, [currentMarketState.baseSymbol])

    return (
        <Modal
            headerText="Close Liquidity Position"
            isOpen={removeLiquidityModalIsOpen}
            onClose={toggleRemoveLiquidityModal}
            size="md"
            p={5}
            body={
                <VStack spacing={10}>
                    <Withdraw />
                    <Box border="1px solid #353E80" borderRadius="10px" p={6} w="100%">
                        <Summary />
                    </Box>
                </VStack>
            }
            footer={
                <Button
                    w="50%"
                    text="Confirm"
                    customType="base-blue"
                    onClick={handleRemoveLiquidity}
                    isDisabled={!isEnabled}
                />
            }
        />
    )
}

export default RemoveLiquidityModal
