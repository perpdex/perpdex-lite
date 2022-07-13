import React, { useMemo } from "react"
import { Box, Text } from "@chakra-ui/react"
import OrderHistoryTable from "./OrderHistoryTable"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getPositionChangedsQuery } from "queries/trades"
import { cleanUpOrderHistories } from "util/chart"
import { useQuery } from "@apollo/client"

function OrderHistory() {
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()

    const positionChangedsResult = useQuery(getPositionChangedsQuery, {
        variables: { market: currentMarket },
    })

    const orderHistories = useMemo(() => {
        if (positionChangedsResult.loading || positionChangedsResult.error) return []
        return cleanUpOrderHistories(positionChangedsResult.data, currentMarketState.inverse)
    }, [
        positionChangedsResult.data,
        positionChangedsResult.loading,
        positionChangedsResult.error,
        currentMarketState.inverse,
    ])

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
