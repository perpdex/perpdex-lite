import { Button, ButtonGroup, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { CurrencyIcon } from "../Icon"
import { MarketState } from "../../constant/types"
import { User } from "../../container/connection/user"
import { AccountPerpdex } from "../../container/perpetual/account"

interface Props {
    marketState: MarketState
}

function AccountInfoTable(props: Props) {
    const { marketState } = props

    // TODO: move to page (component should not depend on container)
    const {
        state: { address },
    } = User.useContainer()

    const {
        actions: { openAccountModal },
    } = AccountPerpdex.useContainer()

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
                            <CurrencyIcon symbol={marketState.quoteSymbol} boxSize={6} mr={1} />
                            <Text>{marketState.quoteSymbol}</Text>
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
                                isDisabled={!address}
                                onClick={() => {
                                    openAccountModal(false)
                                }}
                            >
                                Withdraw
                            </Button>
                            <Button
                                mb={[4, 0]}
                                bgColor="#D9D9D9"
                                borderRadius="10px"
                                isDisabled={!address}
                                onClick={() => {
                                    openAccountModal(true)
                                }}
                            >
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
