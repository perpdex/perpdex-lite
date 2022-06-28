import React from "react"
import { Button as ChakuraButton, ButtonProps } from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"

type ButtonType = "big-green-plus" | "big-pink-minus"

interface ButtonState extends Partial<ButtonProps> {
    text: string
    customType?: ButtonType
    onClick?: () => void
}

function Button({ text, customType, onClick }: ButtonState) {
    switch (customType) {
        case "big-green-plus":
            return (
                <ChakuraButton
                    size="lg"
                    onClick={onClick!}
                    colorScheme="green"
                    variant="outline"
                    leftIcon={<AddIcon />}
                >
                    {text}
                </ChakuraButton>
            )

        case "big-pink-minus":
            return (
                <ChakuraButton
                    size="lg"
                    height={8}
                    onClick={onClick!}
                    colorScheme="pink"
                    variant="outline"
                    leftIcon={<MinusIcon />}
                >
                    {text}
                </ChakuraButton>
            )

        default:
            return (
                <ChakuraButton size="md" onClick={onClick!} colorScheme="gray" variant="outline">
                    {text}
                </ChakuraButton>
            )
    }
}

export default Button
