import { Badge, Box, Button, HStack, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { useCallback, useMemo } from "react"

import DataUnit from "./DataUnit"
import { Position } from "container/perpetual/position"
// import { PositionInfo } from "constant/position"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import Big from "big.js"

interface PositionUnitState {
    marketPair: string
    markPrice: Big
    baseSymbolDisplay: string
    quoteSymbolDisplay: string
    size: Big
    side: string
    estimatedLiquidationPrice: Big
    unrealizedPnl: Big
    averageEntryPrice: Big
}

function PositionUnit({
    marketPair,
    markPrice,
    baseSymbolDisplay,
    quoteSymbolDisplay,
    size,
    side,
    estimatedLiquidationPrice,
    unrealizedPnl,
    averageEntryPrice,
}: PositionUnitState) {
    const { currentMarket } = PerpdexMarketContainer.useContainer()
    const { openClosePositionModal } = Position.useContainer()

    const handleOnClosePositionClick = useCallback(() => {
        if (!currentMarket) return

        openClosePositionModal(currentMarket, baseSymbolDisplay, quoteSymbolDisplay)
    }, [currentMarket, openClosePositionModal, baseSymbolDisplay, quoteSymbolDisplay])

    // const handleOnAdjustMarginClick = useCallback(() => {
    //     openAdjustMarginModal(address, baseAssetSymbol, quoteAssetSymbol)
    // }, [address, baseAssetSymbol, quoteAssetSymbol, openAdjustMarginModal])

    // /* prepare data for UI */
    // const pnlStr = useMemo(() => unrealizedPnl.toFixed(2), [unrealizedPnl])
    // const absSizeStr = useMemo(() => size.abs().toFixed(4), [size])
    // // const leverageStr = useMemo(() => `${new Big(1).div(marginRatio).toFixed(2)}x`, [marginRatio])
    // const entryPriceStr = useMemo(() => {
    //     if (inverse) {
    //         return numberWithCommasUsdc(size.div(openNotional).abs())
    //     } else {
    //         return numberWithCommasUsdc(openNotional.div(size).abs())
    //     }
    // }, [openNotional, size, inverse])
    // // const marginStr = useMemo(() => numberWithCommasUsdc(margin), [margin])
    // // const marginRatioStr = useMemo(() => `${marginRatio.mul(100).toFixed(1)}%`, [marginRatio])

    return useMemo(
        () => (
            <Box>
                <Stack direction="column" spacing={4} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" p={6}>
                    <HStack>
                        <Heading size="md">{marketPair}</Heading>
                        <Badge colorScheme={side === "Long" ? "green" : "red"}>{side}</Badge>
                    </HStack>
                    <SimpleGrid minChildWidth={["40%", "30%", "20%"]} spacing={4}>
                        <DataUnit label="Position Size" value={`${size.abs().toFixed(5)} ${baseSymbolDisplay}`} />
                        <DataUnit label="Mark Price" value={markPrice.toFixed(7)} />
                        <DataUnit label="Entry Price" value={averageEntryPrice.toFixed(7)} />
                        <DataUnit label="PnL" value={unrealizedPnl.toFixed(2)} />
                        <DataUnit label="Est. liquidation price" value={estimatedLiquidationPrice.toFixed(7)} />
                        {/*<DataUnit label="Leverage" value={leverageStr} />*/}
                        {/* <DataUnit label="Est.Liq.Price" value="943" /> */}
                        {/*<DataUnit label="Margin" value={marginStr} />*/}
                        {/*<DataUnit label="Margin Ratio" value={marginRatioStr} />*/}
                    </SimpleGrid>
                    <Box display={["block", "flex"]}>
                        <Button onClick={handleOnClosePositionClick} mb={[4, 0]} colorScheme="blue">
                            Market Close
                        </Button>
                    </Box>
                </Stack>
            </Box>
        ),
        [
            averageEntryPrice,
            baseSymbolDisplay,
            estimatedLiquidationPrice,
            handleOnClosePositionClick,
            markPrice,
            marketPair,
            side,
            size,
            unrealizedPnl,
        ],
    )
}

export default PositionUnit
