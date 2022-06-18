import React, { useEffect, useState } from "react"
import { SimpleGrid, VStack, Box } from "@chakra-ui/react"

import TitleBar from "./TitleBar"
// import Mining from "./Mining"
import ProvidedInfo from "./ProvidedInfo"
import Position from "./Position"
import PoolInfo from "./PoolInfo"
import FrameContainer from "component/FrameContainer"
import { Modal } from "container/modal"
import { useCallback } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import Big from "big.js"

export interface MakerPositionInfo {
    unrealizedPnl: Big
    liquidityValue: Big
    liquidity: Big
    baseAmount: Big
    quoteAmount: Big
    baseDebt: Big
    quoteDebt: Big
}

function LiquidityProvider() {
    const { currentMyMakerInfo, removeLiquidity } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const {
        actions: { toggleLpModal },
    } = Modal.useContainer()

    const [makerPositionInfo, setMakerPositionInfo] = useState<MakerPositionInfo>({
        unrealizedPnl: Big(0),
        liquidityValue: Big(0),
        liquidity: Big(0),
        baseAmount: Big(0),
        quoteAmount: Big(0),
        baseDebt: Big(0),
        quoteDebt: Big(0),
    })

    const markPrice = currentMarketState.markPrice
    const poolInfo = currentMarketState.poolInfo

    useEffect(() => {
        if (!currentMyMakerInfo || !poolInfo || !markPrice || !currentMarketState) return
        if (poolInfo.totalLiquidity.eq(0)) return

        const _markPrice = currentMarketState.inverse ? Big(0).div(markPrice) : markPrice

        const liquidity = currentMyMakerInfo.liquidity

        const baseAmount = liquidity.mul(poolInfo.base).div(poolInfo.totalLiquidity)
        const quoteAmount = liquidity.mul(poolInfo.quote).div(poolInfo.totalLiquidity)
        // TODO:
        const baseDebt = Big(0)
        const quoteDebt = Big(0)

        const info = {
            unrealizedPnl: baseAmount.sub(baseDebt).mul(_markPrice).add(quoteAmount.sub(quoteDebt)), // FIX: consider funding
            liquidityValue: baseAmount.mul(_markPrice).add(quoteAmount),
            liquidity,
            baseAmount,
            quoteAmount,
            baseDebt,
            quoteDebt,
        }
        setMakerPositionInfo(info)
    }, [currentMarketState, currentMyMakerInfo, markPrice, poolInfo])

    const handleOnRemoveLiquidityClick = useCallback(async () => {
        if (!makerPositionInfo) return
        removeLiquidity(
            makerPositionInfo.liquidity,
            makerPositionInfo.baseAmount.mul(0.9),
            makerPositionInfo.quoteAmount.mul(0.9),
        )
    }, [makerPositionInfo, removeLiquidity])

    return (
        <FrameContainer>
            <TitleBar />
            <SimpleGrid columns={2} spacing={8} mt="6">
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4">
                    <VStack spacing={6} p={0}>
                        {/*<Mining />*/}
                        <PoolInfo />
                    </VStack>
                </Box>
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4">
                    <VStack spacing={6} p={0}>
                        <ProvidedInfo marketInfo={currentMarketState} makerPositionInfo={makerPositionInfo} />
                        <Position
                            handleOnAddLiquidityClick={toggleLpModal}
                            handleOnRemoveLiquidityClick={handleOnRemoveLiquidityClick}
                        />
                    </VStack>
                </Box>
            </SimpleGrid>
        </FrameContainer>
    )
}

export default LiquidityProvider
