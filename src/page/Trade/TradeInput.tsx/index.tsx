import React from "react"

import SideSwitcher from "./SideSwitcher"
import Collateral from "./Collateral"
import Slippage from "./Slippage"
import Position from "./Position"

function TradeInput() {
    return (
        <>
            <SideSwitcher />
            <Collateral />
            <Position />
            <Slippage />
        </>
    )
}

export default TradeInput
