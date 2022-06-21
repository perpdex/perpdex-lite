import React, { useCallback } from "react"

import SideSwitcher from "./SideSwitcher"
import Collateral from "./Collateral"
import Slippage from "./Slippage"
import Position from "./Position"
import { calcPositionSize, getCollateralSymbol } from "util/market"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { Trade } from "container/perpetual/trade"
import Big from "big.js"
import { formatInput } from "util/format"

function TradeInput() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { isBaseToQuote, collateral, setCollateral } = Trade.useContainer()

    const handleCollateral = useCallback(
        (value: Big | null) => {
            setCollateral(value)
        },
        [setCollateral],
    )
    const collateralSymbol = getCollateralSymbol(currentMarketState)

    const positionSymbol = isBaseToQuote ? currentMarketState.quoteSymbol : currentMarketState.baseSymbol
    const positionSize =
        collateral &&
        currentMarketState.markPrice &&
        !currentMarketState.markPrice.eq(Big(0)) &&
        calcPositionSize(isBaseToQuote, currentMarketState.inverse, collateral, currentMarketState.markPrice)
    const positionDisplay = positionSize ? formatInput(positionSize.basePosition.toString(), 7) : "⃜⏳"

    return (
        <>
            <SideSwitcher />
            <Collateral collateralSymbol={collateralSymbol} handleCollateral={handleCollateral} />
            <Position positionSymbol={positionSymbol} positionSize={positionDisplay} />
            <Slippage />
        </>
    )
}

export default TradeInput
