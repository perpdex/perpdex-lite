import { Table, Thead, Tbody, Tr, Th, Td, Button, Text } from "@chakra-ui/react"
import { createPoolSummary } from "../../../util/market"
import { MarketState } from "../../../constant/types"
import Big from "big.js"

export interface PositionTableState {
    marketState: MarketState
    isLong: boolean
    positionQuantity: string
    positionValue: string
    entryPriceDisplay: Big
    markPriceDisplay: Big
    liqPriceDisplay: Big
    unrealizedPnl: string
    handleOnClick: () => void
}

function PositionTable({
    isLong,
    positionQuantity,
    positionValue,
    entryPriceDisplay,
    markPriceDisplay,
    liqPriceDisplay,
    unrealizedPnl,
    handleOnClick,
    marketState,
}: PositionTableState) {
    const poolSummary = createPoolSummary(marketState)

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Market</Th>
                    <Th>Qty ({marketState.baseSymbol})</Th>
                    <Th>Value ({marketState.quoteSymbol})</Th>
                    <Th>
                        Entry Price ({marketState.baseSymbolDisplay}/{marketState.quoteSymbolDisplay})
                    </Th>
                    <Th>
                        Mark Price ({marketState.baseSymbolDisplay}/{marketState.quoteSymbolDisplay})
                    </Th>
                    <Th>
                        Liq. price ({marketState.baseSymbolDisplay}/{marketState.quoteSymbolDisplay})
                    </Th>
                    <Th>Unrealzied PNL ({marketState.quoteSymbol})</Th>
                    <Th>Close Position</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>{poolSummary.poolName}</Td>
                    <Td>
                        <Text color={isLong ? "green.300" : "red.300"}>{positionQuantity}</Text>
                    </Td>
                    <Td>{positionValue}</Td>
                    <Td>{entryPriceDisplay.toFixed(7)}</Td>
                    <Td>{markPriceDisplay.toFixed(7)}</Td>
                    <Td>{liqPriceDisplay.toFixed(7)}</Td>
                    <Td>{unrealizedPnl}</Td>
                    <Td>
                        <Button onClick={handleOnClick} mb={[4, 0]} colorScheme="blue">
                            Close Market
                        </Button>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default PositionTable
