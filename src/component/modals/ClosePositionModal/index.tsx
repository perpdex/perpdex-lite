import { useCallback, useMemo, useState } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Transaction } from "container/connection/transaction"
import { Modal as ModalContainer } from "container/modal"
import DiscreteInputModifier from "component/base/DiscreteInputModifier"
import Big from "big.js"
import { BIG_ZERO } from "constant"
import { PerpdexMarketContainer } from "../../../container/connection/perpdexMarketContainer"
import Modal from "component/base/Modal"
import Button from "component/base/Button"

function ClosePositionModal() {
    const [closeValue, setCloseValue] = useState<Big>(BIG_ZERO)
    const {
        positionCloseModalIsOpen,
        actions: { togglePositionCloseModal },
    } = ModalContainer.useContainer()

    const { isLoading: isTxLoading } = Transaction.useContainer()
    const { currentMyTakerPositions, trade } = PerpdexExchangeContainer.useContainer()
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

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
        if (currentMyTakerPositions) {
            const isLong = !currentMyTakerPositions.isLong
            const baseAmount = closeValue
            const slippage = 40 // Future fix

            trade(isLong, baseAmount, slippage)
        }
    }, [closeValue, currentMyTakerPositions, trade])

    const handleCloseModal = useCallback(() => {
        setCloseValue(BIG_ZERO)
        togglePositionCloseModal()
    }, [togglePositionCloseModal])

    return useMemo(
        () => (
            <Modal
                headerText="Close Position"
                isOpen={positionCloseModalIsOpen}
                onClose={handleCloseModal}
                size="md"
                body={
                    currentMyTakerPositions && (
                        <DiscreteInputModifier
                            uiType="simple"
                            inputLabel={`Closed qty ${currentMarketState.baseSymbol}`}
                            assetSymbol={currentMarketState.baseSymbol}
                            discreteValues={[10, 25, 50, 75, 100]}
                            value={closeValue}
                            maxValue={currentMyTakerPositions.positionQuantity}
                            handleUpdate={handleUpdate}
                        />
                    )
                }
                footer={
                    <Button
                        text="Confirm"
                        customType="base-blue"
                        onClick={handleCloseMarket}
                        isDisabled={isDisabled}
                        isLoading={isTxLoading}
                    />
                }
            />
        ),
        [
            positionCloseModalIsOpen,
            handleCloseModal,
            currentMyTakerPositions,
            currentMarketState.baseSymbol,
            closeValue,
            handleUpdate,
            handleCloseMarket,
            isDisabled,
            isTxLoading,
        ],
    )
}

export default ClosePositionModal
