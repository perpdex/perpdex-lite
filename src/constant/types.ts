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
    // totalPositionNotional: Big
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
    baseAssetSymbolDisplay: string
    quoteAssetSymbolDisplay: string
    isLong: boolean
    positionQuantity: Big
    positionValue: Big
    entryPrice: Big
    markPrice: Big
    liqPrice: Big
    unrealizedPnl: Big
}

export interface LongTokenState {
    symbol: string
    assetAddress: string
    assetSymbol: string
    assetDecimals: number
    totalSupply: Big
    totalAssets: Big
    myShares: Big
    myAssets: Big
    maxDeposit: Big
    maxMint: Big
    maxWithdraw: Big
    maxRedeem: Big
}
