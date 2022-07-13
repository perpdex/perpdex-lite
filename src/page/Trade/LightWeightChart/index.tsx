import React, { useMemo } from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getMarketCandlesQuery } from "queries/trades"
import { cleanUpChartInputData } from "util/chart"
import { useQuery } from "@apollo/client"
import Chart from "@qognicafinance/react-lightweight-charts"

const chartOptions = {
    width: 600,
    height: 400,
    layout: {
        background: { color: "#17181e" },
        textColor: "rgba(33, 56, 77, 1)",
    },
    grid: {
        vertLines: { visible: false, color: "rgba(197, 203, 206, 0.7)" },
        horzLines: { visible: false, color: "rgba(197, 203, 206, 0.7)" },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
}

function LightWeightChart() {
    const { currentMarket } = PerpdexMarketContainer.useContainer()

    const candleResult = useQuery(getMarketCandlesQuery, {
        variables: { market: currentMarket },
    })

    const candlestickSeries = useMemo(() => {
        if (candleResult.loading || candleResult.error) return [{ data: [] }]
        const candlesData = candleResult.data
        const chartInputData = cleanUpChartInputData(candlesData)

        return [
            {
                data: chartInputData || [],
            },
        ]
    }, [candleResult.data, candleResult.loading, candleResult.error])

    return <Chart options={chartOptions} candlestickSeries={candlestickSeries} />
}

export default LightWeightChart
