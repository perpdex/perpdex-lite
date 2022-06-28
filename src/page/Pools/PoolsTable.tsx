import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { PoolSummary } from "constant/types"
import { getCurrencyIcon } from "util/market"

export type PoolsTableUnit = PoolSummary

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
                    // const QuoteIcon = getCurrencyIcon("ASTR")

                    return (
                        <Tr
                            _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}
                            onClick={() => handleOnClick(row.address)}
                        >
                            <Td borderBottom={0} verticalAlign="middle">
                                {BaseIcon && <BaseIcon />}
                                {QuoteIcon && <QuoteIcon />}{" "}
                                <span style={{ verticalAlign: "middle" }}>{row.poolName}</span>
                            </Td>
                            <Td borderBottom={0}>{row.tvl}</Td>
                            <Td borderBottom={0}>{row.volume24h}</Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default PoolsTable
