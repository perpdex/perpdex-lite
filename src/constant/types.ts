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

export interface MakerInfo {
    liquidity: Big
    cumBaseSharePerLiquidity: Big
    cumQuotePerLiquidity: Big
}

export interface TakerInfo {
    baseBalanceShare: Big
    quoteBalance: Big
}

interface AccountInfo {
    takerInfos: { [key: string]: TakerInfo }
    makerInfos: { [key: string]: MakerInfo }
    collateralBalance: Big
    totalAccountValue: Big
    totalPositionNotional: Big
}

export interface ExchangeState {
    myAccountInfo: AccountInfo
}
