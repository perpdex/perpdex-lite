import { MarketState, PoolSummary } from "constant/types"

export function createPoolSummary(marketState: MarketState): PoolSummary {
    const poolName = marketState.inverse
        ? `${marketState.quoteSymbol}-${marketState.baseSymbol} (inverse)`
        : `${marketState.baseSymbol}-${marketState.quoteSymbol}`

    return {
        poolName,
        tvl: `${marketState.poolInfo.quote.mul(2).toFixed(3)} ${marketState.quoteSymbol}`,
        volume24h: `10000000 ${marketState.quoteSymbol}`,
    }
}
