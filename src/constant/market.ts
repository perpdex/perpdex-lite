// import Big from "big.js"

type BaseSymbolType = "USD" | "BTC" | "LINK" | "MATIC"

export type QuoteSymbolType = "ETH" | "ASTR"

interface SymbolType {
    [key: string]: BaseSymbolType | QuoteSymbolType
}

export const supportedQuoteSymbol: SymbolType = {
    eth: "ETH",
    astr: "ASTR",
}
