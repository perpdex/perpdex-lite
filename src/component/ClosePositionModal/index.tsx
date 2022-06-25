import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import { useMemo } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Modal as ModalContainer } from "container/modal"

function ClosePositionModal() {
    // address is base token address
    const {
        positionCloseModalIsOpen,
        actions: { togglePositionCloseModal },
    } = ModalContainer.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()

    const { currentMyTakerPositions } = PerpdexExchangeContainer.useContainer()
    // const { closePosition, currentMyTakerPositions } = PerpdexExchangeContainer.useContainer()

    // const { slippage } = Trade.useContainer() // FIX the slippage

    // const handleOnClick = useCallback(async () => {
    //     if (address && currentMyTakerPositions && currentMyTakerPositions.notional && currentMyTakerPositions.size) {
    //         const { notional, size } = currentMyTakerPositions
    //         const slippageLimit = notional.abs().mul(slippage / 100)
    //         const quoteLimit = size.gt(0) ? notional.abs().sub(slippageLimit) : notional.abs().add(slippageLimit)

    //         // FIX: closePosition is not avaibale on the current contract
    //         closePosition(address, quoteLimit)
    //     }
    // }, [address, closePosition, currentMyTakerPositions, slippage])

    return useMemo(
        () => (
            <Modal
                isCentered
                motionPreset="slideInBottom"
                isOpen={positionCloseModalIsOpen}
                onClose={togglePositionCloseModal}
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Close Position ({currentMyTakerPositions?.baseAssetSymbolDisplay})</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody></ModalBody>
                    <ModalFooter>
                        <Button
                            isFullWidth
                            colorScheme="blue"
                            size="md"
                            onClick={() => console.log("FIX")}
                            isLoading={isTxLoading}
                        >
                            Close Position
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        ),
        [
            positionCloseModalIsOpen,
            togglePositionCloseModal,
            currentMyTakerPositions?.baseAssetSymbolDisplay,
            isTxLoading,
        ],
    )
}

export default ClosePositionModal
