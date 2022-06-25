import { Table, Thead, Tbody, Tr, Th, Td, Button, Text } from "@chakra-ui/react"

export interface PositionTableState {
    market: string
    isLong: boolean
    positionQuantity: string
    positionValue: string
    entryPrice: string
    markPrice: string
    liqPrice: string
    unrealizedPnl: string
    handleOnClick: () => void
}

function PositionTable({
    market,
    isLong,
    positionQuantity,
    positionValue,
    entryPrice,
    markPrice,
    liqPrice,
    unrealizedPnl,
    handleOnClick,
}: PositionTableState) {
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th>Markert</Th>
                    <Th>Qty</Th>
                    <Th>Value</Th>
                    <Th>Entry Price</Th>
                    <Th>Mark Price</Th>
                    <Th>Liq. price</Th>
                    <Th>Unrealzied PNL</Th>
                    <Th>Close Position</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td>{market}</Td>
                    <Td>
                        <Text color={isLong ? "green.300" : "red.300"}>{positionQuantity}</Text>
                    </Td>
                    <Td>{positionValue}</Td>
                    <Td>{entryPrice}</Td>
                    <Td>{markPrice}</Td>
                    <Td>{liqPrice}</Td>
                    <Td>{unrealizedPnl}</Td>
                    <Td>
                        <Button onClick={handleOnClick} mb={[4, 0]} colorScheme="blue">
                            Close Market
                        </Button>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default PositionTable
