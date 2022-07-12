import { BIG_ZERO } from "constant"
import { MarketState, PositionState, TakerInfo } from "constant/types"

export function getAllPositionsFromTakerInfos(
    takerInfos: { [key: string]: TakerInfo },
    marketStates: { [key: string]: MarketState },
) {
    const addresses = Object.keys(takerInfos)

    let positions: PositionState[] = []
    for (let i = 0; i < addresses.length; i++) {
        const takerInfo = takerInfos[addresses[i]]
        const marketInfo = marketStates[addresses[i]]

        const size = marketInfo.inverse ? takerInfo.quoteBalance : takerInfo.baseBalanceShare

        if (!size.eq(0)) {
            const position = {
                isLong: size.gt(0), // FIX
                positionQuantity: size.abs(),
                positionValue: BIG_ZERO, // FIX
                entryPriceDisplay: BIG_ZERO, // FIX
                liqPriceDisplay: BIG_ZERO, // FIX
                unrealizedPnl: BIG_ZERO, // FIX
                address: marketInfo.address,
                positionSymbol: marketInfo.baseSymbolDisplay,
            }
            positions.push(position)
        }
    }
    return positions
}
