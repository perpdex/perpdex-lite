import React, { useMemo, useState } from "react"
import { VStack, Flex, Box, Text } from "@chakra-ui/react"

import FrameContainer from "component/frames/FrameContainer"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import { useHistory, useParams } from "react-router-dom"
import PositionTokenHandler from "./PositionTokenHandler"
import Big from "big.js"
import PositionTokenInfo from "./PositionTokenInfo"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"

type RouterParams = {
    marketAddress: string
}

function PositionTokenDetail() {
    const { marketAddress } = useParams<RouterParams>()
    const history = useHistory()
    const [isMint, setIsMint] = useState<boolean>(true)

    const { longTokenStates, deposit, redeem } = PerpdexLongTokenContainer.useContainer()
    const longTokenState = longTokenStates[marketAddress]
    const { marketStates } = PerpdexMarketContainer.useContainer()
    const marketState = marketStates[marketAddress]

    console.log("longTokenState", longTokenState)

    const longTokenInfo = useMemo(() => {
        if (longTokenState) {
            const { assetSymbol, symbol, maxMint, maxRedeem } = longTokenState

            return {
                address: marketAddress,
                assetSymbol,
                symbol,
                maxMint,
                maxRedeem,
            }
        }
    }, [longTokenState, marketAddress])

    const doSwitchToMint = (val: boolean) => setIsMint(val)

    const handleProceed = (val: Big) => {
        if (longTokenInfo) {
            isMint ? deposit(longTokenInfo.address, val) : redeem(longTokenInfo.address, val)
        }
    }

    return (
        <FrameContainer>
            <Flex direction={{ base: "column", lg: "row" }} width="100%">
                <VStack flex="50" spacing={10} mx={10}>
                    <Box mr="auto">
                        <Text as="button" onClick={history.goBack}>
                            ←Back
                        </Text>
                    </Box>
                    <PositionTokenHandler
                        isMint={isMint}
                        doSwitchToMint={doSwitchToMint}
                        tokenSymbol={longTokenInfo?.symbol}
                        quoteSymbol={longTokenInfo?.assetSymbol}
                        currentMaxValue={isMint ? longTokenInfo?.maxMint : longTokenInfo?.maxRedeem}
                        handleProceed={handleProceed}
                    />
                </VStack>
                <VStack flex="50" spacing={10}>
                    <PositionTokenInfo longTokenState={longTokenState} marketState={marketState} />
                    {/*This order history is not token order history.*/}
                    {/*I don't think it's necessary to implement this at this time*/}
                    {/*<BorderFramePanel title="Order History">*/}
                    {/*    <OrderHistoryTable*/}
                    {/*        baseSymbol=""*/}
                    {/*        quoteSymbol=""*/}
                    {/*        data={[*/}
                    {/*            {*/}
                    {/*                isLong: true,*/}
                    {/*                price: Big(392.21),*/}
                    {/*                size: Big(1.2),*/}
                    {/*                time: new Date(),*/}
                    {/*            },*/}
                    {/*        ]}*/}
                    {/*        applyPXZero={true}*/}
                    {/*    />*/}
                    {/*</BorderFramePanel>*/}
                </VStack>
            </Flex>
        </FrameContainer>
    )
}

export default PositionTokenDetail
