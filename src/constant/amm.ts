import Big from "big.js"
import { PerpdexMarket } from "types/newContracts"

export interface Amm {
    contract: PerpdexMarket
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
