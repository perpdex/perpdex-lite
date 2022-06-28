import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { MarketSummary } from "constant/types"
import { getCurrencyIcon } from "util/market"

export type MarketTableUnit = MarketSummary

export interface MarketTableState {
    data: MarketTableUnit[]
    handleOnClick: (address: string) => void
}

function MarketTable({ data, handleOnClick }: MarketTableState) {
    return (
        <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th w="45%">Symbols</Th>
                    <Th>Mark Price</Th>
                    <Th>Volume 24H</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((row: MarketTableUnit) => {
                    const BaseIcon = getCurrencyIcon(row.baseSymbolDisplay)
                    const QuoteIcon = getCurrencyIcon(row.quoteSymbolDisplay)
                    // const QuoteIcon = getCurrencyIcon("ASTR")

                    return (
                        <Tr
                            _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}
                            onClick={() => handleOnClick(row.address)}
                        >
                            <Td borderBottom={0} verticalAlign="middle" padding={1}>
                                {BaseIcon && <BaseIcon />}
                                {QuoteIcon && <QuoteIcon />}{" "}
                                <span style={{ verticalAlign: "middle" }}>{row.marketName}</span>
                            </Td>
                            <Td borderBottom={0} padding={1}>
                                {row.markPrice}
                            </Td>
                            <Td borderBottom={0} padding={1}>
                                {row.volume24h}
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default MarketTable
