import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { CurrencyIcon } from "component/Icon"
import { MarketSummary } from "constant/types"

export interface MarketTableState {
    data: MarketSummary[]
    handleOnClick: (address: string) => void
}

function MarketTable({ data, handleOnClick }: MarketTableState) {
    return (
        <Table variant="simple" size="sm">
            <Thead>
                <Tr>
                    <Th w="45%">Symbols</Th>
                    <Th>Mark Price</Th>
                    {/* <Th>Volume 24H</Th> */}
                </Tr>
            </Thead>
            <Tbody>
                {data.map((row: MarketSummary) => {
                    return (
                        <Tr
                            _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}
                            onClick={() => handleOnClick(row.address)}
                        >
                            <Td borderBottom={0} verticalAlign="middle" padding={1}>
                                <CurrencyIcon symbol={row.quoteSymbolDisplay} boxSize={6} mr={1} />
                                <CurrencyIcon symbol={row.baseSymbolDisplay} boxSize={6} mr={1} />
                                <span style={{ verticalAlign: "middle" }}>{row.marketName}</span>
                            </Td>
                            <Td borderBottom={0} padding={1}>
                                {row.markPrice}
                            </Td>
                            {/* <Td borderBottom={0} padding={1}>
                                {row.volume24h}
                            </Td> */}
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default MarketTable
