import { Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react"
import { createPoolSummary } from "../../../util/market"
import { MarketState } from "../../../constant/types"
import Big from "big.js"
import Button from "component/base/Button"

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
    // const StyledTh = chakra(Th, {
    //     baseStyle: {
    //         color: "white",
    //         borderBottom: "0px none",
    //         fontWeight: "bold",
    //         textTransform: "none",
    //     },
    // })

    // const StyledTd = chakra(Td, {
    //     baseStyle: {
    //         borderBottom: "0px none",
    //     },
    // })

    const poolSummary = createPoolSummary(marketState)

    return (
        // <Table variant="simple">
        //     <Thead>
        //         <Tr>
        //             <StyledTh>Bitcoin - BTC</StyledTh>
        //             <StyledTh>Account Margin Ratio</StyledTh>
        //             <StyledTh>Amount (BTC)</StyledTh>
        //             <StyledTh>Liquidation Price</StyledTh>
        //             <StyledTh>Amount (USD)</StyledTh>
        //             <StyledTh>Leverage</StyledTh>
        //             <StyledTh>Avg. Open Price</StyledTh>
        //             <StyledTh>Profit/Loss</StyledTh>
        //             <StyledTh></StyledTh>
        //         </Tr>
        //     </Thead>
        //     <Tbody>
        //         <Tr>
        //             <StyledTd>Short</StyledTd>
        //             <StyledTd>45.3%</StyledTd>
        //             <StyledTd>0.23147</StyledTd>
        //             <StyledTd>$29787.78</StyledTd>
        //             <StyledTd>$4000</StyledTd>
        //             <StyledTd>4.2x</StyledTd>
        //             <StyledTd>$32680.78</StyledTd>
        //             <StyledTd>$350.27</StyledTd>
        //             <StyledTd>
        //                 <Button size="sm" customType="base-blue" text="Close Position"></Button>
        //             </StyledTd>
        //         </Tr>
        //     </Tbody>
        // </Table>
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
                        <Button customType="base-dark" text="Close Position" onClick={handleOnClick} />
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default PositionTable
