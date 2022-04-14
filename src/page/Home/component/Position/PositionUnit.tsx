import { Badge, Box, Button, HStack, Heading, SimpleGrid, Stack } from "@chakra-ui/react"
import { useCallback, useMemo } from "react"

import DataUnit from "./DataUnit"
import { Position } from "container/position"
import { PositionInfo } from "constant/position"
import { numberWithCommasUsdc } from "util/format"
import { Amm } from "../../../../container/amm"

interface PositionUnitProps {
    data: PositionInfo
}

function PositionUnit({ data }: PositionUnitProps) {
    const { selectedAmm } = Amm.useContainer()
    const inverse = selectedAmm?.inverse
    const { openClosePositionModal } = Position.useContainer()
    // const { openClosePositionModal, openAdjustMarginModal } = Position.useContainer()
    const {
        address,
        baseAssetSymbol,
        quoteAssetSymbol,
        baseAssetSymbolDisplay,
        quoteAssetSymbolDisplay,
        unrealizedPnl,
        size,
        openNotional,
    } = data
    // const { address, baseAssetSymbol, quoteAssetSymbol, unrealizedPnl, size, margin, marginRatio, openNotional } = data
    const isLongSide = size.gte(0)

    const handleOnClosePositionClick = useCallback(() => {
        openClosePositionModal(address, baseAssetSymbol, quoteAssetSymbol)
    }, [address, baseAssetSymbol, quoteAssetSymbol, openClosePositionModal])

    // const handleOnAdjustMarginClick = useCallback(() => {
    //     openAdjustMarginModal(address, baseAssetSymbol, quoteAssetSymbol)
    // }, [address, baseAssetSymbol, quoteAssetSymbol, openAdjustMarginModal])

    /* prepare data for UI */
    const pnlStr = useMemo(() => unrealizedPnl.toFixed(2), [unrealizedPnl])
    const absSizeStr = useMemo(() => size.abs().toFixed(4), [size])
    // const leverageStr = useMemo(() => `${new Big(1).div(marginRatio).toFixed(2)}x`, [marginRatio])
    const entryPriceStr = useMemo(() => {
        if (inverse) {
            return numberWithCommasUsdc(size.div(openNotional).abs())
        } else {
            return numberWithCommasUsdc(openNotional.div(size).abs())
        }
    }, [openNotional, size, inverse])
    // const marginStr = useMemo(() => numberWithCommasUsdc(margin), [margin])
    // const marginRatioStr = useMemo(() => `${marginRatio.mul(100).toFixed(1)}%`, [marginRatio])

    return useMemo(
        () => (
            <Box>
                <Stack direction="column" spacing={4} borderRadius="2xl" borderWidth="1px" borderColor="gray.200" p={6}>
                    <HStack>
                        <Heading size="md">
                            {baseAssetSymbolDisplay}/{quoteAssetSymbolDisplay} {inverse ? "(inverse)" : ""}
                        </Heading>
                        <Badge colorScheme={isLongSide ? "green" : "red"}>{isLongSide ? "Long" : "Short"}</Badge>
                    </HStack>
                    <SimpleGrid minChildWidth={["40%", "30%", "20%"]} spacing={4}>
                        <DataUnit label="PnL" value={pnlStr} />
                        <DataUnit label="Position Size" value={absSizeStr} />
                        {/*<DataUnit label="Leverage" value={leverageStr} />*/}
                        <DataUnit label="Entry Price" value={entryPriceStr} />
                        {/* <DataUnit label="Est.Liq.Price" value="943" /> */}
                        {/*<DataUnit label="Margin" value={marginStr} />*/}
                        {/*<DataUnit label="Margin Ratio" value={marginRatioStr} />*/}
                    </SimpleGrid>
                    <Box display={["block", "flex"]}>
                        <Button onClick={handleOnClosePositionClick} mb={[4, 0]} colorScheme="blue">
                            Close Position
                        </Button>
                        {/*<Spacer />*/}
                        {/*<Button onClick={handleOnAdjustMarginClick}>Margin Management</Button>*/}
                    </Box>
                </Stack>
            </Box>
        ),
        [
            absSizeStr,
            baseAssetSymbolDisplay,
            quoteAssetSymbolDisplay,
            entryPriceStr,
            // handleOnAdjustMarginClick,
            handleOnClosePositionClick,
            isLongSide,
            // leverageStr,
            // marginRatioStr,
            // marginStr,
            pnlStr,
        ],
    )
}

export default PositionUnit
