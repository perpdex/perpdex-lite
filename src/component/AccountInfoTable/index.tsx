import { Button, ButtonGroup, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { CurrencyIcon } from "../Icon"
import { MarketState } from "../../constant/types"

interface Props {
    marketState: MarketState
}

function AccountInfoTable(props: Props) {
    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <Th border="0px">COIN</Th>
                    <Th border="0px">WALLET</Th>
                    <Th border="0px">AMOUNT</Th>
                    <Th border="0px">AVAILABLE</Th>
                    <Th border="0px">ACTION</Th>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <Td border="0px">
                        <HStack>
                            <CurrencyIcon symbol={props.marketState.quoteSymbol} boxSize={6} mr={1}></CurrencyIcon>
                            <Text>{props.marketState.quoteSymbol}</Text>
                        </HStack>
                    </Td>
                    <Td border="0px">20</Td>
                    <Td border="0px">
                        <HStack>
                            <Text>1.2</Text>
                            <Text color="gray.400">($35,140)</Text>
                        </HStack>
                    </Td>
                    <Td border="0px">
                        <HStack>
                            <Text>1.1</Text>
                            <Text color="gray.400">($32,210)</Text>
                        </HStack>
                    </Td>
                    <Td border="0px">
                        <ButtonGroup spacing="6">
                            <Button
                                mb={[4, 0]}
                                color="white"
                                border="1px"
                                borderColor={"#D9D9D9"}
                                borderRadius="10px"
                                variant="solid"
                            >
                                Withdraw
                            </Button>
                            <Button mb={[4, 0]} bgColor="#D9D9D9" borderRadius="10px">
                                Deposit
                            </Button>
                        </ButtonGroup>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default AccountInfoTable
