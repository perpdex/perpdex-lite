import Big from "big.js"

export interface PoolInfo {
    base: Big
    quote: Big
    totalLiquidity: Big
}

export interface PoolSummary {
    poolName: string
    tvl: string
    tvlUsd: string
    volume24h: string
}

export interface MarketState {
    address: string
    exchangeAddress: string
    baseSymbol: string
    quoteSymbol: string
    baseSymbolDisplay: string
    quoteSymbolDisplay: string
    poolInfo: PoolInfo
    markPrice: Big
    markPriceDisplay: Big
    priceFeedQuote: string
    indexPriceQuote: Big
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

export interface AccountInfo {
    takerInfos: { [key: string]: TakerInfo }
    makerInfos: { [key: string]: MakerInfo }
    settlementTokenBalance: Big
    collateralBalance: Big
    totalAccountValue: Big
    mmRatio: Big
}

export interface ExchangeState {
    imRatio: Big
    mmRatio: Big
    myAccountInfo: AccountInfo
}

export interface LpCollateralState {
    base: Big
    quote: Big
}

export interface PositionState {
    isLong: boolean
    positionQuantity: Big
    positionValue: Big
    entryPriceDisplay: Big
    liqPriceDisplay: Big
    unrealizedPnl: Big
}

export interface LongTokenState {
    address: string
    symbol: string
    name: string
    assetAddress: string
    assetSymbol: string
    assetDecimals: number
    assetIsWeth: boolean
    totalSupply: Big
    totalAssets: Big
    myShares: Big
    myAssets: Big
    maxDeposit: Big
    maxMint: Big
    maxWithdraw: Big
    maxRedeem: Big
}
