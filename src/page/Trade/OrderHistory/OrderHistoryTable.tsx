import React from "react"
import { Thead, Table, Tr, Th, Tbody, Td, chakra } from "@chakra-ui/react"

function OrderHistoryTable() {
    const StyledTh = chakra(Th, {
        baseStyle: {
            color: "white",
            borderBottom: "0px none",
            textTransform: "none",
        },
    })

    const StyledTd = chakra(Td, {
        baseStyle: {
            borderBottom: "0px none",
        },
    })

    return (
        <Table variant="simple" overflowY="scroll">
            <Thead>
                <Tr>
                    <StyledTh>Size(ETH)</StyledTh>
                    <StyledTh>Price(USD)</StyledTh>
                    <StyledTh>Time</StyledTh>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr bg="rgba(98, 126, 234, 0.2)">
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr>
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr bg="rgba(98, 126, 234, 0.2)">
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr>
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr bg="rgba(98, 126, 234, 0.2)">
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr>
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
                <Tr bg="rgba(98, 126, 234, 0.2)">
                    <StyledTd>0.32</StyledTd>
                    <StyledTd>$230.32</StyledTd>
                    <StyledTd>10:15:12</StyledTd>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default OrderHistoryTable
