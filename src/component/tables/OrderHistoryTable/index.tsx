import React from "react"
import { Thead, Table, Tr, Th, Tbody, Td, chakra, Text } from "@chakra-ui/react"
import { OrderHistoryUnit } from "constant/types"
import { formattedNumberWithCommas } from "util/format"
import { dateToTime } from "util/time"

interface OrderHistoryTableState {
    title: string
    baseSymbol: string
    quoteSymbol: string
    data: OrderHistoryUnit[] | undefined
}

function OrderHistoryTable({ title, baseSymbol, quoteSymbol, data }: OrderHistoryTableState) {
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
        <>
            <Text align="center" color={"gray.200"}>
                {title}
            </Text>
            <Table variant="simple" overflowY="scroll">
                <Thead>
                    <Tr>
                        <StyledTh>Size({baseSymbol})</StyledTh>
                        <StyledTh>Price({quoteSymbol})</StyledTh>
                        <StyledTh>Time</StyledTh>
                    </Tr>
                </Thead>
                <Tbody>
                    {data &&
                        data.length > 0 &&
                        data.map((value: OrderHistoryUnit, index: number) => (
                            <Tr bg={index % 2 === 0 ? "rgba(98, 126, 234, 0.2)" : ""}>
                                <StyledTd color={value.isLong ? "green.300" : "red.300"}>
                                    {formattedNumberWithCommas(value.size)}
                                </StyledTd>
                                <StyledTd>${formattedNumberWithCommas(value.price)}</StyledTd>
                                <StyledTd>{dateToTime(new Date(value.time))}</StyledTd>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </>
    )
}

export default OrderHistoryTable
