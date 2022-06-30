import { MarketState, PoolSummary } from "constant/types"
import { BTCIcon, ETHIcon, MATICIcon, USDIcon, LINKIcon } from "component/Icon"
import { ASTRIcon } from "component/Icon/astr"

export function createPoolSummary(marketState: MarketState): PoolSummary {
    const poolName = marketState.inverse
        ? `${marketState.quoteSymbol}-${marketState.baseSymbol} (inverse)`
        : `${marketState.baseSymbol}-${marketState.quoteSymbol}`

    return {
        poolName,
        tvl: `${marketState.poolInfo.quote.mul(2).toFixed(3)} ${marketState.quoteSymbol}`,
        volume24h: `10000000 ${marketState.quoteSymbol}`,
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
