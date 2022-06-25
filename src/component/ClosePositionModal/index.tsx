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
import { useCallback, useMemo, useState } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Modal as ModalContainer } from "container/modal"
import DiscreteInputModifier from "component/base/DiscreteInputModifier"
import Big from "big.js"
import { BIG_ZERO } from "constant"

function ClosePositionModal() {
    // address is base token address
    const {
        positionCloseModalIsOpen,
        actions: { togglePositionCloseModal },
    } = ModalContainer.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()
    const [closeValue, setCloseValue] = useState<Big>(BIG_ZERO)

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

    const isDisabled = useMemo(() => {
        return (
            !closeValue ||
            !closeValue.gt(0) ||
            !currentMyTakerPositions ||
            closeValue.gt(currentMyTakerPositions.positionQuantity)
        )
    }, [closeValue, currentMyTakerPositions])

    const handleUpdate = useCallback((value: Big) => {
        setCloseValue(value)
    }, [])

    const handleCloseMarket = useCallback(() => {
        console.log("close value", closeValue.toFixed(6))
    }, [closeValue])

    return useMemo(
        () => (
            <Modal
                isCentered
                motionPreset="slideInBottom"
                isOpen={positionCloseModalIsOpen}
                onClose={togglePositionCloseModal}
                size="md"
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Close Position</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {currentMyTakerPositions && (
                            <DiscreteInputModifier
                                inputLabel={`Closed qty ${currentMyTakerPositions.baseAssetSymbolDisplay}`}
                                assetSymbol={currentMyTakerPositions.baseAssetSymbolDisplay}
                                maxValue={currentMyTakerPositions.positionQuantity}
                                handleUpdate={handleUpdate}
                            />
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isFullWidth
                            colorScheme="blue"
                            size="md"
                            onClick={handleCloseMarket}
                            isDisabled={isDisabled}
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
            currentMyTakerPositions,
            handleUpdate,
            handleCloseMarket,
            isDisabled,
            isTxLoading,
        ],
    )
}

export default ClosePositionModal
