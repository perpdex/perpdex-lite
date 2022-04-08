import React from "react"
import { Button } from "@chakra-ui/react"

interface IButtonPerpdex {
    text: string
    handleClick?: () => void
}

function ButtonPerpdex({ text, handleClick }: IButtonPerpdex) {
    return (
        <Button
            size="md"
            onClick={handleClick!}
            colorScheme="gray"
            variant="outline"
            // leftIcon={<WalletFill boxSize={4} />}
        >
            {text}
        </Button>
    )
}

export default ButtonPerpdex
