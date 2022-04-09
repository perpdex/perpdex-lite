import React from "react"
import { Button } from "@chakra-ui/react"

interface IButtonPerpdex {
    text: string
    onClick?: () => void
}

function ButtonPerpdex({ text, onClick }: IButtonPerpdex) {
    return (
        <Button
            size="md"
            onClick={onClick!}
            colorScheme="gray"
            variant="outline"
            // leftIcon={<WalletFill boxSize={4} />}
        >
            {text}
        </Button>
    )
}

export default ButtonPerpdex
