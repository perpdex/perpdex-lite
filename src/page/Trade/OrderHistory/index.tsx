import React from "react"
import { Box, Text } from "@chakra-ui/react"
import OrderHistoryTable from "./OrderHistoryTable"

function OrderHistory() {
    return (
        <Box
            w="100%"
            borderLeft="1px solid rgba(98, 126, 234, 0.6)"
            p={6}
            mx="0"
            marginInlineStart={[0, "0 !important"]}
            sx={{
                "@media screen and (max-width: 61em)": {
                    borderLeft: "0px none",
                    marginTop: "20px",
                },
            }}
        >
            <Text align="center" color={"gray.200"}>
                Order History
            </Text>
            <OrderHistoryTable />
        </Box>
    )
}

export default OrderHistory
