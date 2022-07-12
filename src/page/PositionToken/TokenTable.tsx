import React from "react"
import { chakra, HStack, Link, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"

import { CurrencyIcon } from "component/Icon"
import Button from "component/base/Button"
import { PerpdexLongTokenContainer } from "container/connection/perpdexLongTokenContainer"
import _ from "lodash"
import { Link as ReactLink } from "react-router-dom"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getLongTokenInfos } from "util/position"
import { formattedNumberWithCommas } from "util/format"

function TokenTable() {
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

    const { longTokenStates } = PerpdexLongTokenContainer.useContainer()
    const { marketStates } = PerpdexMarketContainer.useContainer()

    const longTokenInfos = getLongTokenInfos(longTokenStates, marketStates)

    console.log("@@@@@@ longTokenStates", longTokenInfos)

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <StyledTh>
                        <Text fontSize="lg">Asset</Text>
                    </StyledTh>
                    <StyledTh>
                        <Text fontSize="lg">Name</Text>
                    </StyledTh>
                    <StyledTh>
                        <Text fontSize="lg">24H Vol</Text>
                    </StyledTh>
                    <StyledTh>
                        <Text fontSize="lg">Price</Text>
                    </StyledTh>
                    <StyledTh>
                        <Text fontSize="lg">Balance</Text>
                    </StyledTh>
                    <StyledTh>
                        <Text fontSize="lg">Daily Change</Text>
                    </StyledTh>
                    <StyledTh>
                        <Text fontSize="lg">Actions</Text>
                    </StyledTh>
                </Tr>
            </Thead>
            <Tbody>
                {_.map(longTokenInfos, value => {
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
