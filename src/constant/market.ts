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

export const baseSymbolList = Object.values(supportedBaseSymbol) as BaseSymbolType[]
