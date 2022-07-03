import { MarketState, PoolSummary } from "constant/types"
import { numberWithCommas } from "./format"

export function createPoolSummary(marketState: MarketState): PoolSummary {
    const poolName = marketState.inverse
        ? `${marketState.quoteSymbol}-${marketState.baseSymbol} (inverse)`
        : `${marketState.baseSymbol}-${marketState.quoteSymbol}`

    return {
        poolName,
        tvl: `${numberWithCommas(marketState.poolInfo.quote)} ${marketState.quoteSymbol}`,
        tvlUsd: `$${numberWithCommas(marketState.poolInfo.quote.mul(marketState.indexPriceQuote))}`,
        volume24h: `10000000 ${marketState.quoteSymbol}`,
    }
}
