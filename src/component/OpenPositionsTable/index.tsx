import { Box, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import Button from "component/base/Button"
import { PositionState } from "constant/types"
import { Link } from "react-router-dom"
import { formattedNumberWithCommas } from "util/format"

interface OpenPositionsTableState {
    data: PositionState[] | undefined
    handleOnClick: (address: string) => void
}

function OpenPositionsTable({ data, handleOnClick }: OpenPositionsTableState) {
    return (
        <Box borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6} mx={{ base: "auto", md: "0" }}>
            <Text>Open Positions</Text>
            <Table variant="simple" overflowY="scroll">
                <Thead>
                    <Tr>
                        <Th border="0px" pl={0} w="30%">
                            Assets
                        </Th>
                        <Th border="0px">Profit/Loss</Th>
                        <Th border="0px">Position</Th>
                        <Th border="0px" w="30%">
                            Avg. Open Price
                        </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {data &&
                        data.length > 0 &&
                        data.map((value: PositionState) => (
                            <Tr>
                                <Td border="0px" px={0} color={value.isLong ? "green.300" : "red.300"}>
                                    {formattedNumberWithCommas(value.positionQuantity)} {value?.positionSymbol}
                                </Td>
                                <Td border="0px">{formattedNumberWithCommas(value.unrealizedPnl)}</Td>
                                <Td border="0px">
                                    <Link to="/trade">
                                        <Button
                                            customType="base-blue"
                                            text="Trade"
                                            onClick={() => value.address && handleOnClick(value.address)}
                                        />
                                    </Link>
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
