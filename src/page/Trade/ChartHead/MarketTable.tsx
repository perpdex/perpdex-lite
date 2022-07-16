import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react"
import { CurrencyIcon } from "component/Icon"
import { MarketState } from "constant/types"
import { numberWithCommas } from "../../../util/format"

export interface Props {
    data: MarketState[]
    handleOnClick: (address: string) => void
}

function MarketTable({ data, handleOnClick }: Props) {
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
                {data.map((row: MarketState) => {
                    return (
                        <Tr
                            _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}
                            onClick={() => handleOnClick(row.address)}
                        >
                            <Td borderBottom={0} verticalAlign="middle" padding={1}>
                                <CurrencyIcon symbol={"TODO: row.quoteSymbolDisplay"} boxSize={6} mr={1} />
                                <CurrencyIcon symbol={"TODO: row.baseSymbolDisplay"} boxSize={6} mr={1} />
                                <span style={{ verticalAlign: "middle" }}>{row.name}</span>
                            </Td>
                            <Td borderBottom={0} padding={1}>
                                {numberWithCommas(row.markPriceDisplay)}
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
