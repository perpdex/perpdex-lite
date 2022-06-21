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
    priceFeedQuote: string
    indexPriceQuote: Big
    inverse: Boolean
}

export interface MakerInfo {
    liquidity: Big
    cumBaseSharePerLiquidity: Big
    cumQuotePerLiquidity: Big
}

export interface TakerInfo {
    baseBalanceShare: Big
    quoteBalance: Big
}

export interface AccountInfo {
    takerInfos: { [key: string]: TakerInfo }
    makerInfos: { [key: string]: MakerInfo }
    settlementTokenBalance: Big
    collateralBalance: Big
    totalAccountValue: Big
}

export interface ExchangeState {
    imRatio: Big
    mmRatio: Big
    myAccountInfo: AccountInfo
}
