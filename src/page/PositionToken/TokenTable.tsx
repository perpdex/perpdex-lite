import React from "react"
import { HStack, Link, Table, Tbody, Text, Thead, Tr } from "@chakra-ui/react"

import { CurrencyIcon } from "component/Icon"
import Button from "component/base/Button"
import _ from "lodash"
import { Link as ReactLink } from "react-router-dom"
import { formattedNumberWithCommas } from "util/format"
import { LongTokenState, MarketState } from "constant/types"
import { StyledTd, StyledTh } from "component/tables"

interface TableItem {
    longTokenState: LongTokenState
    marketState: MarketState
}

interface TokenTableState {
    data: TableItem[]
}

function TokenTable({ data }: TokenTableState) {
    // 24H VOL is not required because:
    // - User is not interested in token volume
    // - It is unclear whether it is the volume of tokens or the volume of the market
    // - The volume of the market can be seen on another screen
    const columns = [
        "Asset",
        "Name",
        "Price",
        "TVL",
        "My Balance",
        // "Daily Change", // TODO: implement
        "Actions",
    ]

    return (
        <Table variant="simple">
            <Thead height={68}>
                <Tr>
                    {columns.map(column => (
                        <StyledTh>
                            <Text fontSize="lg">{column}</Text>
                        </StyledTh>
                    ))}
                </Tr>
            </Thead>
            <Tbody>
                {_.map(data, item => {
                    const value = item.longTokenState
                    const marketState = item.marketState

                    const price =
                        value.totalAssets && value.totalSupply && !value.totalSupply.eq(0)
                            ? value.totalAssets.div(value.totalSupply)
                            : void 0

                    return (
                        <Tr>
                            <StyledTd>
                                <HStack>
                                    <CurrencyIcon symbol={marketState?.baseSymbol} boxSize={8} />
                                    <Text>{value.symbol}</Text>
                                </HStack>
                            </StyledTd>
                            <StyledTd>{value.name}</StyledTd>
                            <StyledTd>
                                {formattedNumberWithCommas(price)} {value.assetSymbol}
                            </StyledTd>
                            <StyledTd>
                                {formattedNumberWithCommas(value.totalAssets)} {value.assetSymbol}
                            </StyledTd>
                            <StyledTd>
                                {formattedNumberWithCommas(value.myAssets)} {value.assetSymbol}
                            </StyledTd>
                            <StyledTd>
                                <Link as={ReactLink} to={`/tokens/${marketState?.address}`}>
                                    <Button customType="base-blue" text="Details" />
                                </Link>
                            </StyledTd>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default TokenTable
