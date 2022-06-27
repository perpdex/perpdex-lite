import { MarketStateWithAddress } from "constant/types"

export function createPoolSummary(marketState: MarketStateWithAddress) {
    const poolName = marketState.inverse
        ? `${marketState.quoteSymbol}-${marketState.baseSymbol}`
        : `${marketState.baseSymbol}-${marketState.quoteSymbol}`

    return {
        address: marketState.address,
        quoteSymbol: marketState.inverse ? marketState.baseSymbol : marketState.quoteSymbol,
        poolName,
        tvl: `${marketState.poolInfo.quote.mul(2).toFixed(3)} ${marketState.quoteSymbol}`,
        volume24h: `10000000 ${marketState.quoteSymbol}`,
    }
}
