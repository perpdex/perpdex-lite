import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Button from "component/base/Button"
import { PositionState } from "constant/types"
import { formattedNumberWithCommas } from "util/format"

interface OpenPositionsTableState {
    data: PositionState[] | undefined
}

function OpenPositionsTable({ data }: OpenPositionsTableState) {
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
                    {data &&
                        data.length > 0 &&
                        data.map((value: PositionState) => (
                            <Tr>
                                <Td border="0px" pl={0} color={value.isLong ? "green.300" : "red.300"}>
                                    {formattedNumberWithCommas(value.positionQuantity)} {value?.positionSymbol}
                                </Td>
                                <Td border="0px">{formattedNumberWithCommas(value.unrealizedPnl)}</Td>
                                <Td border="0px">
                                    <Button customType="base-blue" text="Trade" />
                                </Td>
                                <Td border="0px">{formattedNumberWithCommas(value.entryPriceDisplay)}</Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </Box>
    )
}

export default OpenPositionsTable
