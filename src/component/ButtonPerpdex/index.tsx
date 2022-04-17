import React from "react"
import { Button } from "@chakra-ui/react"

interface IButtonPerpdex {
    text: string
    disabled?: boolean
    onClick?: () => void
}

function ButtonPerpdex({ text, disabled, onClick }: IButtonPerpdex) {
    return (
        <Button
            size="md"
            onClick={onClick!}
            colorScheme="gray"
            variant="outline"
            disabled={disabled}
            // leftIcon={<WalletFill boxSize={4} />}
        >
            {text}
        </Button>
    )
}

export default ButtonPerpdex
