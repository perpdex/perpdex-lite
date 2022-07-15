import { Table, Tbody, Tr, Td, chakra, Text } from "@chakra-ui/react"
import React from "react"

function Summary() {
    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    return (
        <>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
                Summary
            </Text>
            <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                <Tbody>
                    <Tr>
                        <StyledTd pl={0}>Liquidity</StyledTd>
                        <StyledTd>$190.8</StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd pl={0}>Entry Price</StyledTd>
                        <StyledTd>$32680.78</StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd pl={0}>Exit Price</StyledTd>
                        <StyledTd>$32680.78</StyledTd>
                    </Tr>
                    <Tr>
                        <StyledTd pl={0}>Remaining Liquidity</StyledTd>
                        <StyledTd>$0</StyledTd>
                    </Tr>
                </Tbody>
            </Table>
        </>
    )
}

export default Summary
