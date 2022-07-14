import { MarketState, PoolSummary } from "constant/types"
import { numberWithCommas } from "./format"

export function createPoolSummary(marketState: MarketState): PoolSummary {
    const poolName = marketState.inverse
        ? `${marketState.quoteSymbol}-${marketState.baseSymbol} (inverse)`
        : `${marketState.baseSymbol}-${marketState.quoteSymbol}`
    const tvl = marketState.poolInfo.quote.mul(2)
    const volume24h = marketState.volume24h
    const fee24h = volume24h.mul(marketState.poolFeeRatio)

    return {
        poolName,
        tvl: `${numberWithCommas(tvl)} ${marketState.quoteSymbol}`,
        tvlUsd: `$${numberWithCommas(tvl.mul(marketState.indexPriceQuote))}`,
        volume24h: `${numberWithCommas(volume24h)} ${marketState.quoteSymbol}`,
        fee24h: `${numberWithCommas(fee24h)} ${marketState.quoteSymbol}`,
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
