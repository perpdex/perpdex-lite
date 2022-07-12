import React, { useEffect, useRef, useState } from "react"
import { createChart } from "lightweight-charts"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { callSubquery } from "util/subquery"
import { getMarketCandlesQuery } from "queries/trades"
import { LineChartUnit } from "constant/types"
import { CleanUpChartInputData } from "util/chart"
import { Box } from "@chakra-ui/react"

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

interface ChartState {
    market: string
    data: LineChartUnit[]
    chart: any
}

const initChartState = {
    market: "",
    data: [],
    chart: undefined,
}

function LightWeightChart() {
    const { currentMarket } = PerpdexMarketContainer.useContainer()
    const [chartState, setChartState] = useState<ChartState>(initChartState)
    const chartElement = document.getElementById("chart")
    const isLoadingChart = useRef<boolean>(false)

    useEffect(() => {
        ;(async () => {
            if (!currentMarket || chartState.market === currentMarket) return

            const candleQuery = getMarketCandlesQuery(currentMarket)
            const candlesData = await callSubquery(candleQuery)
            const chartInputData = CleanUpChartInputData(candlesData)

            if (chartState.chart) chartState.chart.remove()

            if (chartElement && chartInputData && chartInputData !== chartState.data && !isLoadingChart.current) {
                if (chartInputData.length > 0) {
                    isLoadingChart.current = true
                    const _chart = createChart(chartElement, { ...chartOptions })
                    console.log("created new chart", _chart)

                    const lineSeries = _chart.addLineSeries()
                    lineSeries.setData(chartInputData)
                    _chart.timeScale().fitContent()

                    setChartState({
                        market: currentMarket,
                        data: chartInputData,
                        chart: _chart,
                    })
                    isLoadingChart.current = false
                } else {
                    setChartState(initChartState)
                }
            }
        })()
    }, [chartElement, chartState.chart, chartState.data, chartState.market, currentMarket])

    return <Box id="chart" mt={[0, "0 !important"]}></Box>
}

export default LightWeightChart
