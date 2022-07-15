import { OrderHistoryUnit } from "constant/types"
import { BigNumber } from "ethers"
import { bigNum2Big, x96ToBig } from "./format"
import { normalizeToUnixtime } from "./time"
import _ from "lodash"

export function cleanUpChartInputData(candlesData: any) {
    if (!candlesData) return

    const inputData = candlesData.candles.nodes.map((d: any) => ({
        time: normalizeToUnixtime(Number(d.timestamp)),
        open: x96ToBig(BigNumber.from(d.openX96)).toNumber(),
        high: x96ToBig(BigNumber.from(d.highX96)).toNumber(),
        low: x96ToBig(BigNumber.from(d.lowX96)).toNumber(),
        close: x96ToBig(BigNumber.from(d.closeX96)).toNumber(),
    }))

    if (!inputData || inputData.length === 0) return

    return _.sortBy(inputData, (data: any) => data.time)
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
        const realizedPnl = bigNum2Big(history.realizedPnl)

        const price = x96ToBig(BigNumber.from(history.sharePriceAfterX96), inverse)
        const time = normalizeToUnixtime(Number(history.timestamp))
        return {
            size,
            isLong,
            price,
            time,
            market: history.market,
            realizedPnl,
        } as OrderHistoryUnit
    })

    return _.sortBy(histories, (data: any) => -data.time)
}
