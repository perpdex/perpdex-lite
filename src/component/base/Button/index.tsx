import React from "react"
import { Button as ChakuraButton, ButtonProps } from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"

type ButtonType = "big-green-plus" | "big-pink-minus"

interface ButtonState extends Partial<ButtonProps> {
    text: string
    customType?: ButtonType
    onClick?: () => void
}

function Button({ text, customType, onClick, ...props }: ButtonState) {
    switch (customType) {
        case "big-green-plus":
            return (
                <ChakuraButton
                    size="lg"
                    onClick={onClick!}
                    colorScheme="green"
                    variant="outline"
                    leftIcon={<AddIcon />}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        case "big-pink-minus":
            return (
                <ChakuraButton
                    size="md"
                    height={8}
                    onClick={onClick!}
                    colorScheme="pink"
                    variant="outline"
                    leftIcon={<MinusIcon />}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        default:
            return (
                <ChakuraButton size="md" onClick={onClick!} colorScheme="gray" variant="outline" {...props}>
                    {text}
                </ChakuraButton>
            )
    }
}

export default Button
