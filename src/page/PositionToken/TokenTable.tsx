import React from "react"
import { HStack, Link, Table, Tbody, Text, Thead, Tr } from "@chakra-ui/react"

import { CurrencyIcon } from "component/Icon"
import Button from "component/base/Button"
import _ from "lodash"
import { Link as ReactLink } from "react-router-dom"
import { formattedNumberWithCommas } from "util/format"
import { LongTokenState } from "constant/types"
import { StyledTd, StyledTh } from "component/tables"

interface TokenTableState {
    data: Partial<LongTokenState>[]
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
        "Balance",
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
                {_.map(data, value => {
                    return (
                        <Tr>
                            <StyledTd>
                                <HStack>
                                    <CurrencyIcon symbol={value?.marketSymbol} boxSize={8} />
                                    <Text>{value.symbol}</Text>
                                </HStack>
                            </StyledTd>
                            <StyledTd>{value.name}</StyledTd>
                            <StyledTd>{value?.markPrice && formattedNumberWithCommas(value.markPrice)}</StyledTd>
                            <StyledTd>{value?.myAssets && formattedNumberWithCommas(value.myAssets)}</StyledTd>
                            <StyledTd>
                                <Link as={ReactLink} to={`/tokens/${value.address}`}>
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
