import React from "react"
import { Button as ChakuraButton, ButtonProps } from "@chakra-ui/react"
import { AddIcon, MinusIcon } from "@chakra-ui/icons"

type ButtonType = "big-green-plus" | "big-pink-minus" | "base-blue" | "base-dark"

interface ButtonState extends Partial<ButtonProps> {
    text: string
    customType?: ButtonType
    onClick?: () => void
}

function Button({ text, customType, onClick, ...props }: ButtonState) {
    switch (customType) {
        case "base-blue":
            return (
                <ChakuraButton
                    size="md"
                    color="white"
                    bgColor="#353E80"
                    borderRadius="10px"
                    onClick={onClick!}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        case "base-dark":
            return (
                <ChakuraButton
                    size="md"
                    color="white"
                    border="1px"
                    borderColor={"#353E80"}
                    borderRadius="10px"
                    variant="solid"
                    onClick={onClick!}
                    {...props}
                >
                    {text}
                </ChakuraButton>
            )

        case "big-green-plus":
            return (
                <ChakuraButton
                    size="md"
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
