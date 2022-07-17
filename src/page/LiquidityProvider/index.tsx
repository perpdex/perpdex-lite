import React, { useEffect, useMemo } from "react"
import { VStack, Center, Flex } from "@chakra-ui/react"

import TitleBar from "./TitleBar"
import YourLiquidity from "./YourLiquidity"
import PoolInfo from "./PoolInfo"
import FrameContainer from "component/frames/FrameContainer"
import { Modal } from "container/modal"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import Big from "big.js"
import { useHistory, useParams } from "react-router-dom"
import Breadcrumb, { BreadcrumbUnit } from "component/base/Breadcrumb"
import { PoolSummary, MakerPositionInfo } from "constant/types"
import { createMakerPositionInfo, createPoolSummary } from "util/market"
import Button from "component/base/Button"

const initMakerPositionInfo: MakerPositionInfo = {
    unrealizedPnl: Big(0),
    liquidityValue: Big(0),
    liquidityValueUsd: Big(0),
    liquidity: Big(0),
    baseAmount: Big(0),
    quoteAmount: Big(0),
    baseDeleveraged: Big(0),
    quoteDeleveraged: Big(0),
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
        actions: { toggleLpModal, toggleRemoveLiquidityModal },
    } = Modal.useContainer()

    const markPrice = currentMarketState.markPrice
    const poolInfo = currentMarketState.poolInfo

    const makerPositionInfo = useMemo<MakerPositionInfo>(() => {
        return createMakerPositionInfo(currentMarketState, currentMyMakerInfo) || initMakerPositionInfo
    }, [currentMarketState, currentMyMakerInfo, markPrice, poolInfo])

    const poolSummary: PoolSummary | undefined = useMemo(() => {
        return currentMarketState ? createPoolSummary(currentMarketState) : undefined
    }, [currentMarketState])

    const breadcrumbLayers: BreadcrumbUnit[] = [
        { name: "Home", to: "/" },
        { name: "Pools", to: "/pools" },
        { name: currentMarketState?.name || "-" },
    ]

    const haveLiquidity = useMemo(() => {
        return makerPositionInfo.liquidity.gt(0)
    }, [makerPositionInfo.liquidity])

    return (
        <FrameContainer>
            <Breadcrumb layers={breadcrumbLayers} />
            <TitleBar title={currentMarketState?.name || "-"} />
            <Flex my="6">
                {poolSummary && currentMarketState && markPrice && (
                    <PoolInfo
                        marketState={currentMarketState}
                        tvl={poolSummary.tvl}
                        volume24h={poolSummary.volume24h}
                        fee24h={poolSummary.fee24h}
                    />
                )}
                <Center width="100%">
                    <VStack>
                        <Button text="Add Liquidity" customType="big-green-plus" width="15em" onClick={toggleLpModal} />
                        {haveLiquidity && (
                            <Button
                                text="Remove Liquidity"
                                customType="big-pink-minus"
                                width="15em"
                                onClick={toggleRemoveLiquidityModal}
                            />
                        )}
                    </VStack>
                </Center>
            </Flex>
            {haveLiquidity && <YourLiquidity marketInfo={currentMarketState} makerPositionInfo={makerPositionInfo} />}
        </FrameContainer>
    )
}

export default LiquidityProvider
