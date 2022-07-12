import { LineChartUnit } from "constant/types"
import { BigNumber } from "ethers"
import { x96ToBig } from "./format"

export function CleanUpChartInputData(candlesData: any) {
    if (!candlesData) return

    const inputData = candlesData.candles.nodes.map((d: any) => ({
        time: Number(d.timestamp),
        value: x96ToBig(BigNumber.from(d.closeX96)).toNumber(),
    })) as LineChartUnit[]

    if (!inputData || inputData.length === 0) return

    const sortedInputData = inputData.sort((v1, v2) => v1.time - v2.time)

    let removeIndexs: number[] = []
    for (let i = 0; i < sortedInputData.length; i++) {
        if (i > 0) {
            const diff = sortedInputData[i].time - sortedInputData[i - 1].time
            if (diff === 0) {
                removeIndexs.push(i)
            }
        }
    }
    removeIndexs.map(i => sortedInputData.splice(i, 1))
    return sortedInputData
}
