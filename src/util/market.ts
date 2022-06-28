import { MarketStateWithAddress } from "constant/types"
import { BTCIcon, ETHIcon, MATICIcon, USDIcon, LINKIcon } from "component/Icon"
import { ASTRIcon } from "component/Icon/astr"

export function createPoolSummary(marketState: MarketStateWithAddress) {
    const quoteSymbolDisplay = marketState.inverse ? marketState.baseSymbol : marketState.quoteSymbol
    const baseSymbolDisplay = marketState.inverse ? marketState.quoteSymbol : marketState.baseSymbol

    const poolName = `${baseSymbolDisplay}${quoteSymbolDisplay}`
    return {
        address: marketState.address,
        quoteSymbolDisplay,
        baseSymbolDisplay,
        poolName,
        tvl: `${marketState.poolInfo.quote.mul(2).toFixed(3)} ${marketState.quoteSymbol}`,
        volume24h: `10000 ${marketState.quoteSymbol}`,
    }
}

export function createMarketSummary(marketState: MarketStateWithAddress) {
    const quoteSymbolDisplay = marketState.inverse ? marketState.baseSymbol : marketState.quoteSymbol
    const baseSymbolDisplay = marketState.inverse ? marketState.quoteSymbol : marketState.baseSymbol

    const marketName = `${baseSymbolDisplay}${quoteSymbolDisplay}`

    return {
        address: marketState.address,
        quoteSymbolDisplay,
        baseSymbolDisplay,
        marketName,
        markPrice: marketState.markPrice.toFixed(4),
        volume24h: `10000 ${marketState.quoteSymbol}`,
    }
}

export function getCurrencyIcon(symbol: string) {
    switch (symbol) {
        case "ETH":
            return ETHIcon
        case "BTC":
            return BTCIcon
        case "USD":
            return USDIcon
        case "MATIC":
            return MATICIcon
        case "LINK":
            return LINKIcon
        case "ASTR":
            return ASTRIcon
        default:
            return undefined
    }
}
