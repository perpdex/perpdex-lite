import { OrderHistoryUnit } from "constant/types"
import { BigNumber } from "ethers"
import { bigNum2Big, x96ToBig } from "./format"

export function sortByTime(data: any, isDesc: boolean) {
    return data.sort((v1: any, v2: any) => (isDesc ? v2.time - v1.time : v1.time - v2.time))
}

export function cleanUpChartInputData(candlesData: any) {
    if (!candlesData) return

    const inputData = candlesData.candles.nodes.map((d: any) => ({
        time: Number(d.timestamp),
        open: x96ToBig(BigNumber.from(d.openX96)).toNumber(),
        high: x96ToBig(BigNumber.from(d.highX96)).toNumber(),
        low: x96ToBig(BigNumber.from(d.lowX96)).toNumber(),
        close: x96ToBig(BigNumber.from(d.closeX96)).toNumber(),
    }))

    if (!inputData || inputData.length === 0) return

    const sortedInputData = sortByTime(inputData, false)

    let i = sortedInputData.length
    while (i > 1 && i--) {
        const diff = sortedInputData[i].time - sortedInputData[i - 1].time
        if (diff === 0) {
            sortedInputData.splice(i, 1)
        }
    }
    return sortedInputData
}

export function cleanUpOrderHistories(queryResponse: any, inverse: boolean) {
    if (!queryResponse || !queryResponse.positionChangeds.nodes) return

    const positionHistories = queryResponse.positionChangeds.nodes

    const histories: OrderHistoryUnit[] = positionHistories.map((history: any) => {
        console.log("each history", history)

        const base = BigNumber.from(history.base)
        // const quote = BigNumber.from(history.quote)

        const isLong = base.gt(0)
        const size = bigNum2Big(base.abs())

        const price = x96ToBig(BigNumber.from(history.sharePriceAfterX96), inverse)
        const time = Number(history.timestamp)
        return {
            size,
            isLong,
            price,
            time,
        } as OrderHistoryUnit
    })

    return sortByTime(histories, true)
}
