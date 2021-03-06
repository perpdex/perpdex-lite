import { useMemo, useState } from "react"
import { createContainer } from "unstated-next"
import { Side } from "constant"
import Big from "big.js"

export const Trade = createContainer(useTrade)

function useTrade() {
    /* long = 1, short = 0 */
    const [side, setSide] = useState<Side>(Side.Long)

    const [isBaseToQuote, setIsBaseToQuote] = useState<boolean>(true)

    /* min: 1, max: 10 */
    const [leverage, setLeverage] = useState<number>(1)

    /* min: 0% */
    const [slippage, setSlippage] = useState<number>(2)

    const [collateral, setCollateral] = useState<Big | null>(null)

    return useMemo(
        () => ({
            side,
            setSide,
            isBaseToQuote,
            setIsBaseToQuote,
            leverage,
            setLeverage,
            slippage,
            setSlippage,
            collateral,
            setCollateral,
        }),
        [side, isBaseToQuote, leverage, slippage, collateral],
    )
}
