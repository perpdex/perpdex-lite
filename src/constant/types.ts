import Big from "big.js"

export interface PoolInfo {
    base: Big
    quote: Big
    totalLiquidity: Big
}

export interface MarketState {
    exchangeAddress: string
    baseSymbol: string
    quoteSymbol: string
    poolInfo: PoolInfo
    markPrice: Big
    inverse: Boolean
}
