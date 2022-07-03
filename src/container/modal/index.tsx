import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

function useModal() {
    const [walletModalIsOpen, setWalletModalIsOpen] = useState<boolean>(false)
    const [lpModalIsOpen, setLpModalIsOpen] = useState<boolean>(false)
    const [removeLiquidityModalIsOpen, setRemoveLiquidityModalIsOpen] = useState<boolean>(false)
    const [positionCloseModalIsOpen, setPositionCloseModalIsOpen] = useState<boolean>(false)

    const toggleWalletModal = useCallback(() => {
        setWalletModalIsOpen(!walletModalIsOpen)
    }, [walletModalIsOpen])

    const toggleLpModal = useCallback(() => {
        setLpModalIsOpen(!lpModalIsOpen)
    }, [lpModalIsOpen])

    const toggleRemoveLiquidityModal = useCallback(() => {
        setRemoveLiquidityModalIsOpen(!removeLiquidityModalIsOpen)
    }, [removeLiquidityModalIsOpen])

    const togglePositionCloseModal = useCallback(() => {
        setPositionCloseModalIsOpen(!positionCloseModalIsOpen)
    }, [positionCloseModalIsOpen])

    return {
        walletModalIsOpen,
        lpModalIsOpen,
        removeLiquidityModalIsOpen,
        positionCloseModalIsOpen,
        actions: {
            toggleWalletModal,
            toggleLpModal,
            toggleRemoveLiquidityModal,
            togglePositionCloseModal,
        },
    }
}

export const Modal = createContainer(useModal)
