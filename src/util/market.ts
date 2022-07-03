import { MarketState, PoolSummary } from "constant/types"
import { numberWithCommas } from "./format"

export function createPoolSummary(marketState: MarketState): PoolSummary {
    const poolName = marketState.inverse
        ? `${marketState.quoteSymbol}-${marketState.baseSymbol} (inverse)`
        : `${marketState.baseSymbol}-${marketState.quoteSymbol}`
    const tvl = marketState.poolInfo.quote.mul(2)

    return {
        poolName,
        tvl: `${numberWithCommas(tvl)} ${marketState.quoteSymbol}`,
        tvlUsd: `$${numberWithCommas(tvl.mul(marketState.indexPriceQuote))}`,
        volume24h: `10000000 ${marketState.quoteSymbol}`,
    }
}
