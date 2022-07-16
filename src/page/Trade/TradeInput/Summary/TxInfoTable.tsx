import { Table, Tbody, Td, Tr } from "@chakra-ui/react"
import Big from "big.js"
import { numberWithCommas } from "../../../../util/format"

interface Props {
    execPriceDisplay?: Big
    priceImpact?: Big
    error?: string
}

function TxInfoTable(props: Props) {
    const { execPriceDisplay, priceImpact, error } = props

    return (
        <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
            <Tbody>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Exec Price
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {error ? "-" : numberWithCommas(execPriceDisplay)}
                    </Td>
                </Tr>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Price Impact
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {error ? "-" : numberWithCommas(priceImpact?.mul(100)) + "%"}
                    </Td>
                </Tr>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Error
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {error}
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default TxInfoTable
