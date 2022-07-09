import { chakra, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react"

function OrderHistoryTable() {
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

    return (
        <Table variant="simple">
            <Thead>
                <Tr>
                    <StyledTh>Time</StyledTh>
                    <StyledTh>Asset</StyledTh>
                    <StyledTh>Position Size</StyledTh>
                    <StyledTh>Market Side</StyledTh>
                    <StyledTh>Realized PnL</StyledTh>
                    <StyledTh>Trading Fee</StyledTh>
                </Tr>
            </Thead>
            <Tbody>
                <Tr>
                    <StyledTd>aaaaaa</StyledTd>
                    <StyledTd>aaaaa</StyledTd>
                    <StyledTd>aaaaa</StyledTd>
                    <StyledTd>aaaaa</StyledTd>
                    <StyledTd>aaaa</StyledTd>
                    <StyledTd>aaaaa</StyledTd>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default OrderHistoryTable
