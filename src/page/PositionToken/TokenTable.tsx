import React from "react"
import { chakra, HStack, Link, Table, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react"

import { CurrencyIcon } from "component/Icon"
import Button from "component/base/Button"
import { PerpdexLongTokenContainer } from "container/connection/perpdexLongTokenContainer"
import _ from "lodash"
import { Link as ReactLink } from "react-router-dom"

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
                {_.map(longTokenStates, (_value, marketAddress) => (
                    <Tr>
                        <StyledTd>
                            <HStack>
                                <CurrencyIcon symbol={"USD"} boxSize={8} />
                                <Text>{longTokenStates[marketAddress].symbol}</Text>
                            </HStack>
                        </StyledTd>
                        <StyledTd>1x Long BTC/ETH</StyledTd>
                        <StyledTd>$12,132.32</StyledTd>
                        <StyledTd>928.89</StyledTd>
                        <StyledTd>0</StyledTd>
                        <StyledTd>1.9%</StyledTd>
                        <StyledTd>
                            <Link as={ReactLink} to={`/tokens/${marketAddress}`}>
                                <Button customType="base-blue" text="Details" />
                            </Link>
                        </StyledTd>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    )
}

export default TokenTable
