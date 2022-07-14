import { VStack } from "@chakra-ui/react"
import Collateral from "./Collateral"
import Slippage from "./Slippage"
import { useCallback, useEffect, useState } from "react"
import { Modal as ModalContainer } from "container/modal"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { LpCollateralState } from "constant/types"
import { BIG_ZERO } from "constant"
import { Trade } from "../../../container/perpetual/trade"
import Modal from "component/base/Modal"
import Button from "component/base/Button"

const initialLpCollateral = {
    base: BIG_ZERO,
    quote: BIG_ZERO,
}

function LiquidityProviderModal() {
    const {
        lpModalIsOpen,
        actions: { toggleLpModal },
    } = ModalContainer.useContainer()

    const { addLiquidity } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const { slippage } = Trade.useContainer()
    const [collateralValues, setCollateralValues] = useState<LpCollateralState>(initialLpCollateral)

    const handleAddLiquidity = useCallback(() => {
        const base = collateralValues.base
        const quote = collateralValues.quote

        addLiquidity(base, quote, base.mul(1.0 - slippage / 100), quote.mul(1.0 - slippage / 100))
        console.log("slippage", slippage)
    }, [collateralValues.base, collateralValues.quote, addLiquidity, slippage])

    // Reset values when market is updated
    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setCollateralValues(initialLpCollateral)
        }
    }, [currentMarketState.baseSymbol])

    return (
        <Modal
            headerText="Add Liquidity"
            isOpen={lpModalIsOpen}
            onClose={toggleLpModal}
            size="md"
            p={5}
            body={
                <VStack spacing={10}>
                    <Collateral
                        currentMarketState={currentMarketState}
                        collateralValues={collateralValues}
                        setCollateralValues={setCollateralValues}
                    />
                    <Slippage />
                </VStack>
            }
            footer={<Button text="Confirm Transaction" customType="base-blue" onClick={handleAddLiquidity} />}
        />
    )
}

export default LiquidityProviderModal
