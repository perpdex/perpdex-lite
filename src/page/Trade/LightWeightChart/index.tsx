import React, { useEffect, useState } from "react"
import { createChart } from "lightweight-charts"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"

const chartOptions = {
    width: 1200,
    height: 600,
    layout: {
        background: { color: "#17181e" },
    },
    grid: { vertLines: { visible: false }, horzLines: { visible: false } },
}

function LightWeightChart() {
    const { currentMarket } = PerpdexMarketContainer.useContainer()

    const [chartMarket, setChartMarket] = useState<string>("")
    const [chart, setChart] = useState<any>(undefined)
    const chartElement = document.getElementById("chart")

    useEffect(() => {
        if (chartElement && currentMarket && chartMarket !== currentMarket) {
            if (chart) chart.remove()

            const _chart = createChart(chartElement, { ...chartOptions })

            const lineSeries = _chart.addLineSeries()
            lineSeries.setData([
                { time: "2019-06-19", value: 993 },
                { time: "2019-06-20", value: 1127 },
                { time: "2019-06-21", value: 1124 },
                { time: "2019-06-22", value: 1056 },
                { time: "2019-06-23", value: 1143 },
                { time: "2019-06-24", value: 1226 },
                { time: "2019-06-25", value: 1243 },
                { time: "2019-06-26", value: 1199 },
                { time: "2019-06-27", value: 1193 },
                { time: "2022-06-28", value: 1205 },
            ])
            _chart.timeScale().fitContent()

            setChartMarket(currentMarket)
            setChart(_chart)
        }
    }, [chart, chartElement, chartMarket, currentMarket])

    return <div id="chart"></div>
}

export default LightWeightChart
