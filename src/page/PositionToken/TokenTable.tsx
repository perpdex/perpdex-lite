import React from "react"
import { chakra, HStack, Link, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"

import { CurrencyIcon } from "component/Icon"
import Button from "component/base/Button"
import _ from "lodash"
import { Link as ReactLink } from "react-router-dom"
import { formattedNumberWithCommas } from "util/format"
import { LongTokenState } from "constant/types"

interface TokenTableState {
    data: Partial<LongTokenState>[]
}

function TokenTable({ data }: TokenTableState) {
    const StyledTh = chakra(Th, {
        baseStyle: {
            color: "white",
            borderBottom: "0px none",
            fontWeight: "bold",
            textTransform: "none",
        },
    })

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    const columns = ["Asset", "Name", "24H Vol", "Price", "Balance", "Daily Change", "Actions"]

    return (
        <Table variant="simple">
            <Thead>
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
