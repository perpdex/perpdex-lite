import Big from "big.js"

export interface Amm {
    address: string
    baseAssetSymbol: string
    quoteAssetSymbol: string
    baseAssetSymbolDisplay: string
    quoteAssetSymbolDisplay: string
    tradeLimitRatio: Big
    tollRatio: Big
    indexPrice: Big
    inverse: boolean
}

export enum Dir {
    AddToAmm = 0,
    RemoveFromAmm = 1,
}
