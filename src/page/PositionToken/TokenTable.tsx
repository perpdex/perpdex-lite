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
    const columns = ["Asset", "Name", "24H Vol", "Price", "Balance", "Daily Change", "Actions"]

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
                            <StyledTd>-</StyledTd>
                            <StyledTd>{value?.markPrice && formattedNumberWithCommas(value.markPrice)}</StyledTd>
                            <StyledTd>{value?.myAssets && formattedNumberWithCommas(value.myAssets)}</StyledTd>
                            <StyledTd>-</StyledTd>
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
