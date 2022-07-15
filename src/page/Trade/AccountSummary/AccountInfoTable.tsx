import { Table, Tbody, Td, Tr } from "@chakra-ui/react"
import Big from "big.js"
import { numberWithCommas } from "../../../util/format"
import { AccountInfo, ExchangeState, MarketState } from "../../../constant/types"

interface Props {
    marketState: MarketState
    myAccountInfo: AccountInfo
    exchangeState: ExchangeState
}

function AccountInfoTable(props: Props) {
    const myAccountInfo = props.myAccountInfo
    const marketState = props.marketState
    const exchangeState = props.exchangeState

    const quoteSymbol = marketState.quoteSymbol
    const totalAccountValue = myAccountInfo?.totalAccountValue || Big(0)
    const totalAccountValueUsd = totalAccountValue.mul(marketState.indexPriceQuote)
    const collateralBalance = myAccountInfo?.collateralBalance || Big(0)
    const collateralBalanceUsd = collateralBalance.mul(marketState.indexPriceQuote)
    const leverage = myAccountInfo?.leverage
    const marginRatio = myAccountInfo?.marginRatio
    const mmRatio = exchangeState?.mmRatio

    return (
        <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
            <Tbody>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Total Account Value ({quoteSymbol})
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {numberWithCommas(totalAccountValue)}
                    </Td>
                </Tr>

                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Total Account Value (USD)
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        ${numberWithCommas(totalAccountValueUsd)}
                    </Td>
                </Tr>

                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Collateral ({quoteSymbol})
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {numberWithCommas(collateralBalance)}
                    </Td>
                </Tr>

                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Collateral (USD)
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        ${numberWithCommas(collateralBalanceUsd)}
                    </Td>
                </Tr>

                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Leverage
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {numberWithCommas(leverage)}x
                    </Td>
                </Tr>

                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Margin ratio
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {numberWithCommas(marginRatio?.mul(100))}%
                    </Td>
                </Tr>

                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Maintenance Margin ratio
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {numberWithCommas(mmRatio?.mul(100))}%
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default AccountInfoTable
