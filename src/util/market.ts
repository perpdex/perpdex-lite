import Big from "big.js"
import { MarketState } from "constant/types"

export function getCollateralSymbol(marketInfo?: MarketState) {
    return marketInfo ? (marketInfo.inverse ? marketInfo.baseSymbol : marketInfo.quoteSymbol) : ""
}

export function calcPositionSize(isBaseToQuote: boolean, inverse: boolean, notional: Big, markPrice: Big) {
    const basePosition = isBaseToQuote ? notional : notional.div(markPrice)
    const oppositPosition = isBaseToQuote ? notional.mul(markPrice) : notional
    if (inverse) {
        return {
            basePosition: oppositPosition,
            oppositPosition: basePosition,
        }
    } else {
        return {
            basePosition,
            oppositPosition,
        }
    }
}
