import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

function useModal() {
    const [walletModalIsOpen, setWalletModalIsOpen] = useState<boolean>(false)
    const [lpModalIsOpen, setLpModalIsOpen] = useState<boolean>(false)

    const toggleWalletModal = useCallback(() => {
        setWalletModalIsOpen(!walletModalIsOpen)
    }, [walletModalIsOpen])

    const toggleLpModal = useCallback(() => {
        setLpModalIsOpen(!lpModalIsOpen)
    }, [lpModalIsOpen])

    return {
        walletModalIsOpen,
        lpModalIsOpen,
        actions: {
            toggleWalletModal,
            toggleLpModal,
        },
    }
}

export const Modal = createContainer(useModal)
