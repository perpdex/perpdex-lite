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
    inverse: boolean
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

export interface TakerPositionsInfo {
    notional: Big
    size: Big
    margin: Big
    unrealizedPnl: Big
    fee: Big
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

export interface LpCollateralState {
    base: Big
    quote: Big
}

export interface PositionState {
    market: string
    isLong: boolean
    positionQuantity: Big
    positionValue: Big
    entryPrice: Big
    markPrice: Big
    liqPrice: Big
    unrealizedPnl: Big
}
