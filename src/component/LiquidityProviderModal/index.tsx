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
    Box,
    Button,
} from "@chakra-ui/react"
import MarketSelector from "../Perpetual/MarketSelector"
import Collateral from "./Collateral"
// import Position from "./Position"
import Slippage from "./Slippage"
import { useCallback, useMemo, useState } from "react"
import { Modal as ModalContainer } from "container/modal"
import Big from "big.js"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { AddIcon } from "@chakra-ui/icons"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"

function LiquidityProviderModal() {
    const {
        lpModalIsOpen,
        actions: { toggleLpModal },
    } = ModalContainer.useContainer()

    const { addLiquidity } = PerpdexExchangeContainer.useContainer()
    const {
        currentMarketState: { markPrice, inverse },
        marketStates,
    } = PerpdexMarketContainer.useContainer()

    console.log("marketStates", marketStates, markPrice.toString())

    // const indexPrice = selectedAmm?.indexPrice || Big(0)

    const [collateral, setCollateral] = useState<Big>(Big(0))

    const baseAmount = useMemo(() => {
        if (markPrice && markPrice.gt(0)) {
            return inverse ? collateral : collateral.div(markPrice)
        } else {
            console.error(
                "This is the first time to add Liquidity Pool, so you need to specify MarkPrice maually, or use some index prices",
            )
            // const defaultMarkPrice = Big(964) // ETHUSD
            // return collateral.div(defaultMarkPrice)
            return Big(0)
        }
    }, [collateral, inverse, markPrice])

    const handleAddLiquidity = useCallback(
        e => {
            // const defaultMarkPrice = Big(964)
            // const inverseQuoteAmount = collateral.mul(defaultMarkPrice)
            const inputBaseAmount = inverse ? collateral.mul(markPrice) : baseAmount

            addLiquidity(inputBaseAmount, collateral, inputBaseAmount.mul(0.9), collateral.mul(0.9))
        },
        [collateral, markPrice, baseAmount, inverse, addLiquidity],
    )

    return (
        <Modal isCentered motionPreset="slideInBottom" isOpen={lpModalIsOpen} onClose={toggleLpModal}>
            <ModalOverlay />
            <ModalContent borderRadius="2xl" pb={3}>
                <ModalHeader>Add Liquidity</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={5}>
                        <MarketSelector />
                        <Collateral onChange={setCollateral} />
                        <Box>baseAmount: {inverse ? collateral.toString() : baseAmount.toString()}</Box>
                        {/*<Position/>*/}
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
