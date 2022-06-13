import { useCallback, useState } from "react"
import { createContainer } from "unstated-next"

export const LiquidityProvider = createContainer(useLiquidityProvider)

function useLiquidityProvider() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    const toggleModal = useCallback(() => {
        setIsModalOpen(!isModalOpen)
    }, [isModalOpen])

    return {
        isModalOpen,
        toggleModal,
    }
}
