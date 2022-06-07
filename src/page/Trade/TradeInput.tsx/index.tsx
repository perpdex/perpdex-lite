import React from "react"

import SideSwitcher from "./SideSwitcher"
import Collateral from "./Collateral"
import Slippage from "./Slippage"

function TradeInput() {
    return (
        <>
            <SideSwitcher />
            <Collateral />
            <Slippage />
        </>
    )
}

export default TradeInput
