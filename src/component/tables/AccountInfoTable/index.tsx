import { Box, ButtonGroup, HStack, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"
import { CurrencyIcon } from "../../Icon"
import { AccountInfo, MarketState } from "../../../constant/types"
import { numberWithCommas } from "../../../util/format"
import Button from "../../base/Button"
import Big from "big.js"

interface Props {
    marketState: MarketState
    myAccountInfo: AccountInfo
    accountAvailable: boolean
    openAccountModal: (isDeposit: boolean) => void
}

function AccountInfoTable(props: Props) {
    const { marketState, myAccountInfo, accountAvailable, openAccountModal } = props

    const totalAccountValue = myAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(marketState.indexPriceQuote)
    const collateralBalance = myAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(marketState.indexPriceQuote)

    return (
        <Box alignSelf={{ base: "", lg: "normal" }}>
            <Table variant="simple">
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
                                    customType="base-blue"
                                    text="Deposit"
                                    isDisabled={!accountAvailable}
                                    onClick={() => {
                                        openAccountModal(true)
                                    }}
                                />
                                <Button
                                    customType="base-dark"
                                    text="Withdraw"
                                    isDisabled={!accountAvailable}
                                    onClick={() => {
                                        openAccountModal(false)
                                    }}
                                />
                            </ButtonGroup>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export default AccountInfoTable
