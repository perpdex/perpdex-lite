// import Big from "big.js"

export type BaseSymbolType = "USD" | "BTC" | "LINK" | "MATIC"

export type BaseAssetType = "usd" | "btc" | "link" | "matic"

export type QuoteSymbolType = "ETH" | "ASTR"

interface SymbolType {
    [key: string]: BaseSymbolType | QuoteSymbolType
}

export const supportedBaseSymbol: SymbolType = {
    usd: "USD",
    btc: "BTC",
    link: "LINK",
    matic: "MATIC",
}

export const supportedQuoteSymbol: SymbolType = {
    eth: "ETH",
    astr: "ASTR",
}

export interface InverseMarket {
    baseAddress: string
    baseAssetSymbol: BaseSymbolType
    quoteAssetSymbol: QuoteSymbolType
    baseAssetSymbolDisplay: string
    quoteAssetSymbolDisplay: string
    // tradeLimitRatio: Big
    // tollRatio: Big
    // indexPrice: Big
    // inverse: boolean
}

export const baseSymbolList = Object.values(supportedBaseSymbol) as BaseSymbolType[]
