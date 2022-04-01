import { Table, Tbody, Td, Tr, Heading } from "@chakra-ui/react"

function ProvidedInfoTable() {
    return (
        <>
            <Heading w="full" size="sm">
                Provided Liquidity
            </Heading>
            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                <Tbody>
                    <Tr fontWeight="bold">
                        <Td>Total Liquidity</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Total Fees</Td>
                        <Td isNumeric>{1}%</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Base APR</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Margin Ratio</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Rewards APR</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Account Leverage</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </>
    )
}

export default ProvidedInfoTable
