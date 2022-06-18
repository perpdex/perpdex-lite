import { useEffect, useState } from "react"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { Trade } from "container/perpetual/trade"
import { formatInput } from "util/format"
import Big from "big.js"

function calcPositionSize(isBaseToQuote: boolean, notional: Big, markPrice: Big) {
    return isBaseToQuote ? notional.mul(markPrice) : notional
}

export function usePositionSize() {
    const {
        currentMarketState: { markPrice },
    } = PerpdexMarketContainer.useContainer()
    const { collateral, isBaseToQuote } = Trade.useContainer()

    const [positionSize, setPositionSize] = useState<string>("")
    const [isCalculating, setIsCalculating] = useState<boolean>(false)

    /**
     * 1. trigger by user
     * 2. trigger by contract event
     */

    /* case1: trigger by user */
    useEffect(() => {
        async function updatePositionByUserControl() {
            if (!markPrice) return

            if (collateral === null) {
                setPositionSize("")
                return
            }

            /* early return if the collateral is zero */
            if (collateral.eq(0)) {
                setPositionSize("0")
                return
            }

            setIsCalculating(true)

            /* calculate the position size */
            const notional = collateral.mul(1)
            // const positionReceived = await getInputPrice(dir, notional)
            const position = calcPositionSize(isBaseToQuote, notional, markPrice)
            console.log("position", isBaseToQuote, notional, markPrice, position)

            const positionDisplay = formatInput(position.toString(), 7)

            setPositionSize(positionDisplay)
            setIsCalculating(false)
        }
        updatePositionByUserControl()
    }, [collateral, isBaseToQuote, markPrice])

    return { positionSize, isCalculating }
}
