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
} from "@chakra-ui/react"
import MarketSelector from "./MarketSelector"
import Collateral from "./Collateral"
import Position from "./Position"
import Slippage from "./Slippage"
import { useMemo } from "react"
import { LiquidityProvider } from "container/liquidityProvider"
import AddButton from "./AddButton"

function LiquidityProviderModal() {
    const {
        state: { isLiquidityProviderModalOpen },
        closeLiquidityProviderModal,
    } = LiquidityProvider.useContainer()

    return useMemo(
        () => (
            <Modal
                isCentered
                motionPreset="slideInBottom"
                isOpen={isLiquidityProviderModalOpen}
                onClose={closeLiquidityProviderModal}
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Add Liquidity</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <MarketSelector />
                            <Collateral />
                            <Position />
                            <Divider />
                            <Slippage />
                            <Divider />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <AddButton />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        ),
        [closeLiquidityProviderModal, isLiquidityProviderModalOpen],
    )
}

export default LiquidityProviderModal
