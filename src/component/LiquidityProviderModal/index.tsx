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
        currentMarketState: { markPrice },
    } = PerpdexMarketContainer.useContainer()

    // const indexPrice = selectedAmm?.indexPrice || Big(0)

    const [collateral, setCollateral] = useState<Big>(Big(0))

    const baseAmount = useMemo(() => {
        if (markPrice && markPrice.gt(0)) {
            return collateral.mul(markPrice)
            // } else if (indexPrice.gt(0)) {
            //     return collateral.div(indexPrice)
        } else {
            return Big(0)
        }
    }, [collateral, markPrice])

    const handleAddLiquidity = useCallback(
        e => {
            console.log("test", collateral, markPrice, baseAmount)
            addLiquidity(baseAmount, collateral, baseAmount.mul(0.9), collateral.mul(0.9))
        },
        [baseAmount, collateral, markPrice, addLiquidity],
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
                        <Box>baseAmount: {baseAmount.toString()}</Box>
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
