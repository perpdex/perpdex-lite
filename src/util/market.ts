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

export function createMarketSummary(marketState: MarketState) {
    const quoteSymbolDisplay = marketState.inverse ? marketState.baseSymbol : marketState.quoteSymbol
    const baseSymbolDisplay = marketState.inverse ? marketState.quoteSymbol : marketState.baseSymbol

    const marketName = `${baseSymbolDisplay}${quoteSymbolDisplay}`

    return {
        address: marketState.address,
        quoteSymbolDisplay,
        baseSymbolDisplay,
        marketName,
        markPrice: numberWithCommas(marketState.markPrice),
        // volume24h: `10000 ${marketState.quoteSymbol}`,
    }
}
