import { Dir, Side } from "constant"
import { useCallback, useEffect, useState } from "react"

import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { Trade } from "container/trade"
import { formatInput } from "util/format"
import Big from "big.js"

export function usePositionSize() {
    const {
        state: { currentMarket },
    } = PerpdexMarketContainer.useContainer()
    const { collateral, side } = Trade.useContainer()
    const dir = side === Side.Long ? Dir.AddToAmm : Dir.RemoveFromAmm

    const ammName = currentMarket
    // const { getInputPrice } = useRealtimeAmm(ammAddress, ammName)

    const getInputPrice = useCallback(() => Big(0), [])

    const [positionSize, setPositionSize] = useState<string>("")
    const [isCalculating, setIsCalculating] = useState<boolean>(false)

    /**
     * 1. trigger by user
     * 2. trigger by contract event
     */

    /* case1: trigger by user */
    useEffect(() => {
        async function updatePositionByUserControl() {
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
            const positionReceived = await getInputPrice()

            let formattedValue = ""
            if (positionReceived !== null) {
                formattedValue = formatInput(positionReceived.toString(), 7)
            }

            setPositionSize(formattedValue)
            setIsCalculating(false)
        }
        updatePositionByUserControl()
    }, [dir, getInputPrice, collateral])

    return { positionSize, isCalculating, dir }
}
