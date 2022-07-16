import { MarketState, PoolSummary } from "constant/types"
import { numberWithCommas } from "./format"

export function createPoolSummary(marketState: MarketState): PoolSummary {
    const tvl = marketState.poolInfo.quote.mul(2)
    const volume24h = marketState.volume24h
    const fee24h = volume24h.mul(marketState.poolFeeRatio)

    return {
        tvl: `${numberWithCommas(tvl)} ${marketState.quoteSymbol}`,
        tvlUsd: `$${numberWithCommas(tvl.mul(marketState.indexPriceQuote))}`,
        volume24h: `${numberWithCommas(volume24h)} ${marketState.quoteSymbol}`,
        fee24h: `${numberWithCommas(fee24h)} ${marketState.quoteSymbol}`,
    }
}
