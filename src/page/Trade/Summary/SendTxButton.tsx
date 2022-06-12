import { Button } from "@chakra-ui/react"

interface SendTxButtonProps {
    isDisabled: boolean
    isLoading: boolean
    handleOnClick: () => void
}

function SendTxButton({ isDisabled, isLoading, handleOnClick }: SendTxButtonProps) {
    return (
        <Button
            size="md"
            disabled={isDisabled}
            isLoading={isLoading}
            isFullWidth
            colorScheme="blue"
            onClick={handleOnClick}
        >
            Send Transaction
        </Button>
    )
}

export default SendTxButton
