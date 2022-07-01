import React, { useEffect, useMemo, useState } from "react"
import { VStack, Box, Center, Flex } from "@chakra-ui/react"

import TitleBar from "./TitleBar"
// import Mining from "./Mining"
import YourLiquidity from "./YourLiquidity"
import PoolInfo from "./PoolInfo"
import FrameContainer from "component/FrameContainer"
import { Modal } from "container/modal"
import { useCallback } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import Big from "big.js"
import { useHistory, useParams } from "react-router-dom"
import Breadcrumb, { BreadcrumbUnit } from "component/base/Breadcrumb"
import { PoolSummary } from "constant/types"
import { createPoolSummary } from "util/market"
import Button from "component/base/Button"

const initMakerPositionInfo = {
    unrealizedPnl: Big(0),
    liquidityValue: Big(0),
    liquidity: Big(0),
    baseAmount: Big(0),
    quoteAmount: Big(0),
    baseDebt: Big(0),
    quoteDebt: Big(0),
}

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
    const { marketAddress } = useParams<{ marketAddress: string }>()
    const history = useHistory()
    const { currentMyMakerInfo, removeLiquidity } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState, marketStates, setCurrentMarket } = PerpdexMarketContainer.useContainer()

    useEffect(() => {
        if (marketAddress && marketStates) {
            console.log("updated", marketAddress)
            if (marketStates[marketAddress]) setCurrentMarket(marketAddress)
            else history.push("/pools")
        }
    }, [history, marketAddress, marketStates, setCurrentMarket])

    const {
        actions: { toggleLpModal },
    } = Modal.useContainer()

    const [makerPositionInfo, setMakerPositionInfo] = useState<MakerPositionInfo>(initMakerPositionInfo)

    const markPrice = currentMarketState.markPrice
    const poolInfo = currentMarketState.poolInfo

    useEffect(() => {
        if (!currentMyMakerInfo || !poolInfo || !markPrice || !currentMarketState) return
        if (poolInfo.totalLiquidity.eq(0)) return setMakerPositionInfo(initMakerPositionInfo)

        const liquidity = currentMyMakerInfo.liquidity

        const baseAmount = liquidity.mul(poolInfo.base).div(poolInfo.totalLiquidity)
        const quoteAmount = liquidity.mul(poolInfo.quote).div(poolInfo.totalLiquidity)
        // TODO:
        const baseDebt = Big(0)
        const quoteDebt = Big(0)

        const unrealizedPnl = baseAmount.sub(baseDebt).mul(markPrice).add(quoteAmount.sub(quoteDebt))

        console.log("markPrice", markPrice.toString())
        const liquidityValue = baseAmount.mul(markPrice).add(quoteAmount)

        const info = {
            unrealizedPnl, // FIX: consider funding
            liquidityValue,
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

    const poolSummary: PoolSummary | undefined = useMemo(() => {
        return currentMarketState ? createPoolSummary(currentMarketState) : undefined
    }, [currentMarketState])

    const breadcrumbLayers: BreadcrumbUnit[] = [
        { name: "Home", to: "/" },
        { name: "Pools", to: "/pools" },
        { name: poolSummary?.poolName || "-" },
    ]

    const haveLiquidity = useMemo(() => {
        return makerPositionInfo.liquidity.gt(0)
    }, [makerPositionInfo.liquidity])

    return (
        <FrameContainer>
            <Breadcrumb layers={breadcrumbLayers} />
            <TitleBar title={poolSummary?.poolName || "-"} />
            <Flex mt="6">
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4" width={400}>
                    <VStack spacing={6} p={0}>
                        {/*<Mining />*/}
                        {poolSummary && currentMarketState && markPrice && (
                            <PoolInfo
                                marketState={currentMarketState}
                                tvl={poolSummary.tvl}
                                volume24h={poolSummary.volume24h}
                            />
                        )}
                    </VStack>
                </Box>
                <Center width="100%">
                    <VStack>
                        <Button text="Add Liquidity" customType="big-green-plus" onClick={toggleLpModal} />
                        {haveLiquidity && (
                            <Button
                                text="Remove Liquidity"
                                customType="big-pink-minus"
                                onClick={handleOnRemoveLiquidityClick}
                            />
                        )}
                    </VStack>
                </Center>
            </Flex>
            {haveLiquidity && (
                <Box borderStyle="solid" borderWidth="1px" borderRadius="12px" p="4" mt="6">
                    <VStack spacing={6} p={0}>
                        <YourLiquidity marketInfo={currentMarketState} makerPositionInfo={makerPositionInfo} />
                        {/* <Position
                            handleOnAddLiquidityClick={toggleLpModal}
                            handleOnRemoveLiquidityClick={handleOnRemoveLiquidityClick}
                        /> */}
                    </VStack>
                </Box>
            )}
        </FrameContainer>
    )
}

export default LiquidityProvider
