import { Table, Tbody, Td, Tr, Heading } from "@chakra-ui/react"

function PoolInfoTable() {
    return (
        <>
            <Heading w="full" size="sm">
                Pool Info
            </Heading>
            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                <Tbody>
                    <Tr fontWeight="bold">
                        <Td>Pool Base APR</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Pool Rewards APR</Td>
                        <Td isNumeric>{1}%</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Mark Price</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>TVL</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>Volume (24h)</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                    <Tr fontWeight="bold">
                        <Td>24h Fees</Td>
                        <Td isNumeric>{1}</Td>
                    </Tr>
                </Tbody>
            </Table>
        </>
    )
}

export default PoolInfoTable
