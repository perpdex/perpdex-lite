import { MakerInfo, MarketState, PoolSummary, MakerPositionInfo } from "constant/types"
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

export function createMakerPositionInfo(marketState: MarketState, makerInfo: MakerInfo): MakerPositionInfo | undefined {
    if (!marketState?.poolInfo || !marketState?.markPrice || !marketState?.indexPriceQuote || !makerInfo) return void 0
    const { poolInfo, markPrice } = marketState
    if (poolInfo.totalLiquidity.eq(0)) return void 0

    const liquidity = makerInfo.liquidity

    const baseShare = liquidity.mul(poolInfo.base).div(poolInfo.totalLiquidity)
    const quoteAmount = liquidity.mul(poolInfo.quote).div(poolInfo.totalLiquidity)
    const baseDeleveraged = liquidity.mul(marketState.cumBasePerLiquidity.sub(makerInfo.cumBaseSharePerLiquidity))
    const quoteDeleveraged = liquidity.mul(marketState.cumQuotePerLiquidity.sub(makerInfo.cumQuotePerLiquidity))

    const unrealizedPnl = baseShare
        .add(baseDeleveraged)
        .mul(marketState.baseBalancePerShare)
        .mul(markPrice)
        .add(quoteAmount.add(quoteDeleveraged))

    console.log("markPrice", markPrice.toString())
    const liquidityValue = quoteAmount.mul(2)
    const liquidityValueUsd = liquidityValue.mul(marketState.indexPriceQuote)

    return {
        unrealizedPnl,
        liquidityValue,
        liquidityValueUsd,
        liquidity,
        baseAmount: baseShare.mul(marketState.baseBalancePerShare),
        quoteAmount,
        baseDeleveraged: baseDeleveraged.mul(marketState.baseBalancePerShare),
        quoteDeleveraged,
    }
}
