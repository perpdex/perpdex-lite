import { Button, ButtonGroup, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { CurrencyIcon } from "../Icon"
import { AccountInfo, MarketState } from "../../constant/types"
import { User } from "../../container/connection/user"
import { AccountPerpdex } from "../../container/perpetual/account"
import { numberWithCommas } from "../../util/format"
import Big from "big.js"

interface Props {
    marketState: MarketState
    myAccountInfo: AccountInfo
}

function AccountInfoTable(props: Props) {
    const { marketState, myAccountInfo } = props

    // TODO: move to page (component should not depend on container)
    const {
        state: { address },
    } = User.useContainer()

    const {
        actions: { openAccountModal },
    } = AccountPerpdex.useContainer()

    const totalAccountValue = myAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(marketState.indexPriceQuote)
    const collateralBalance = myAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(marketState.indexPriceQuote)

    return (
        <Table variant="simple" mx={{ base: "auto", md: "0" }}>
            <Thead>
                <Tr>
                    <Th border="0px">COIN</Th>
                    <Th border="0px">WALLET BALANCE</Th>
                    <Th border="0px">TOTAL ACCOUNT VALUE</Th>
                    <Th border="0px">COLLATERAL</Th>
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
                    <Td border="0px">{numberWithCommas(myAccountInfo?.settlementTokenBalance)}</Td>
                    <Td border="0px">
                        <HStack>
                            <Text>{numberWithCommas(totalAccountValue)}</Text>
                            <Text color="gray.400">(${numberWithCommas(totalAccountValueUsd)})</Text>
                        </HStack>
                    </Td>
                    <Td border="0px">
                        <HStack>
                            <Text>{numberWithCommas(collateralBalance)}</Text>
                            <Text color="gray.400">(${numberWithCommas(collateralBalanceUsd)})</Text>
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
