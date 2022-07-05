import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Button from "component/base/Button"

function OpenPositionsTable() {
    return (
        <Box borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6} mx={{ base: "auto", md: "0" }}>
            <Text>Open Positions</Text>
            <Table variant="simple" overflowY="scroll">
                <Thead>
                    <Tr>
                        <Th border="0px" pl={0}>
                            Assets
                        </Th>
                        <Th border="0px">Profit/Loss</Th>
                        <Th border="0px">Position</Th>
                        <Th border="0px">Avg. Open Price</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    <Tr>
                        <Td border="0px" pl={0}>
                            0.0234 BTC
                        </Td>
                        <Td border="0px">+2.34</Td>
                        <Td border="0px">
                            <Button customType="base-blue" text="Trade" />
                        </Td>
                        <Td border="0px">$2,333.57</Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export default OpenPositionsTable
