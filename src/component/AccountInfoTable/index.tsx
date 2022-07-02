import { Button, ButtonGroup, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { ETHIcon } from "../Icon"

function AccountInfoTable() {
    return (
        <Table variant="simple" mx={{ base: "auto", md: "0" }}>
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
                            <ETHIcon boxSize={6} mr={1}></ETHIcon>
                            <Text>ETH/wETH</Text>
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
