import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { createPoolSummary, getCurrencyIcon } from "util/market"
import { MarketState } from "../../constant/types"

export type PoolsTableUnit = MarketState

export interface PoolsTableState {
    data: PoolsTableUnit[]
    handleOnClick: (address: string) => void
}

function PoolsTable({ data, handleOnClick }: PoolsTableState) {
    return (
        <Table variant="simple">
            <Thead height={68}>
                <Tr>
                    <Th width="50%">Pool</Th>
                    <Th>TVL</Th>
                    <Th>Volume 24H</Th>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((row: PoolsTableUnit) => {
                    const BaseIcon = getCurrencyIcon(row.baseSymbolDisplay)
                    const QuoteIcon = getCurrencyIcon(row.quoteSymbolDisplay)
                    const poolSummary = createPoolSummary(row)

                    return (
                        <Tr
                            _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}
                            onClick={() => handleOnClick(row.address)}
                        >
                            <Td borderBottom={0} verticalAlign="middle">
                                {BaseIcon && <BaseIcon />}
                                {QuoteIcon && <QuoteIcon />}{" "}
                                <span style={{ verticalAlign: "middle" }}>{poolSummary.poolName}</span>
                            </Td>
                            <Td borderBottom={0}>{poolSummary.tvl}</Td>
                            <Td borderBottom={0}>{poolSummary.volume24h}</Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default PoolsTable
