import {
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Button,
    Text,
} from "@chakra-ui/react"
import Collateral from "./Collateral"
import Slippage from "./Slippage"
import { useCallback, useEffect, useState } from "react"
import { Modal as ModalContainer } from "container/modal"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { AddIcon } from "@chakra-ui/icons"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { LpCollateralState } from "constant/types"
import { BIG_ZERO } from "constant"
import { numberWithCommas } from "../../util/format"
import { Trade } from "../../container/perpetual/trade"

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
        <Modal isCentered motionPreset="slideInBottom" isOpen={lpModalIsOpen} onClose={toggleLpModal}>
            <ModalOverlay />
            <ModalContent borderRadius="2xl" pb={3}>
                <ModalHeader>Add Liquidity</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={5}>
                        <Text align="center" fontSize="medium" fontWeight="bold" lineHeight="1.4">
                            Mark Price: {numberWithCommas(currentMarketState.markPriceDisplay)}
                            {currentMarketState.baseSymbolDisplay}/{currentMarketState.quoteSymbolDisplay}
                        </Text>
                        <Collateral
                            currentMarketState={currentMarketState}
                            collateralValues={collateralValues}
                            setCollateralValues={setCollateralValues}
                        />
                        <Divider />
                        <Slippage />
                        <Divider />
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button
                        onClick={handleAddLiquidity}
                        isFullWidth
                        size="md"
                        leftIcon={<AddIcon />}
                        colorScheme="pink"
                        variant="solid"
                    >
                        Add Liquidity
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default LiquidityProviderModal
