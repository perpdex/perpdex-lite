import React, { useMemo } from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { getCandlesQuery } from "queries/trades"
import { cleanUpChartInputData } from "util/chart"
import { useQuery } from "@apollo/client"
import Chart from "@qognicafinance/react-lightweight-charts"
import moment from "moment"

const chartOptions = {
    layout: {
        background: { color: "#17181e" },
        textColor: "rgba(255, 255, 255, 1)",
    },
    grid: {
        vertLines: { visible: false, color: "rgba(197, 203, 206, 0.7)" },
        horzLines: { visible: false, color: "rgba(197, 203, 206, 0.7)" },
    },
    timeScale: {
        timeVisible: true,
        secondsVisible: false,
    },
    localization: {
        timeFormatter: (time: number) => {
            return moment.unix(time).format()
        },
    },
}

function LightWeightChart() {
    const { currentMarket, currentMarketState } = PerpdexMarketContainer.useContainer()

    const candleResult = useQuery(getCandlesQuery, {
        variables: {
            markets: [currentMarket],
            timeFormats: [60 * 60],
        },
    })

    const candlestickSeries = useMemo(() => {
        if (candleResult.loading || candleResult.error) return [{ data: [] }]
        const candlesData = candleResult.data
        const chartInputData = cleanUpChartInputData(candlesData, currentMarketState.inverse)

        return [
            {
                data: chartInputData || [],
            },
        ]
    }, [candleResult.data, candleResult.loading, candleResult.error])

    return <Chart autoWidth={true} autoHeight={true} options={chartOptions} candlestickSeries={candlestickSeries} />
}

export default LightWeightChart
