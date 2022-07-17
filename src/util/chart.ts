import { OrderHistoryUnit } from "constant/types"
import { BigNumber } from "ethers"
import { bigNum2Big, x96ToBig } from "./format"
import { normalizeToUnixtime } from "./time"
import _ from "lodash"
import Big from "big.js"

export function cleanUpChartInputData(candlesData: any, inverse: boolean) {
    if (!candlesData) return

    const x96ToNumber = (x96: string) => {
        return x96ToBig(BigNumber.from(x96), inverse).toNumber()
    }

    const inputData = candlesData.candles.nodes.map((d: any) => ({
        time: normalizeToUnixtime(Number(d.timestamp)),
        open: x96ToNumber(d.openX96),
        high: x96ToNumber(d.highX96),
        low: x96ToNumber(d.lowX96),
        close: x96ToNumber(d.closeX96),
    }))

    // Make it easy to understand
    for (let i = 1; i < inputData.length; i++) {
        const prevClose = inputData[i - 1].close
        inputData[i].open = prevClose
        inputData[i].high = Math.max(inputData[i].high, prevClose)
        inputData[i].low = Math.min(inputData[i].low, prevClose)
    }

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
        const isLongDisplay = inverse ? !isLong : isLong
        const realizedPnl = bigNum2Big(history.realizedPnl)

        const sharePrice = x96ToBig(BigNumber.from(history.sharePriceAfterX96))
        const baseBalancePerShare = x96ToBig(BigNumber.from(history.baseBalancePerShareX96))
        const price = sharePrice.div(baseBalancePerShare)
        const priceDisplay = inverse ? Big(1).div(price) : price

        const size = bigNum2Big(base.abs()).mul(baseBalancePerShare)
        const time = normalizeToUnixtime(Number(history.timestamp))
        return {
            size,
            isLong,
            isLongDisplay,
            priceDisplay,
            time,
            market: history.market,
            realizedPnl,
        } as OrderHistoryUnit
    })

    return _.sortBy(histories, (data: any) => -data.time)
}
