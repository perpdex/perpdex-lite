import React, { useEffect, useState } from "react"
import { Box, Text } from "@chakra-ui/react"
import OrderHistoryTable from "./OrderHistoryTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getPositionChangedsQuery } from "queries/trades"
import { callSubquery } from "util/subquery"
import { cleanUpOrderHistories } from "util/chart"
import { OrderHistoryUnit } from "constant/types"

function OrderHistory() {
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()
    const [orderHistories, setOrderHistories] = useState<OrderHistoryUnit[] | undefined>(undefined)

    useEffect(() => {
        ;(async () => {
            const positionChangedsQuery = getPositionChangedsQuery(currentMarket)
            const queryResponse = await callSubquery(positionChangedsQuery)
            const _orderHistories = cleanUpOrderHistories(queryResponse, currentMarketState.inverse)
            setOrderHistories(_orderHistories)
            console.log("order histories", _orderHistories)
        })()
    }, [currentMarket, currentMarketState.inverse])

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
            <OrderHistoryTable data={orderHistories} />
        </Box>
    )
}

export default OrderHistory
