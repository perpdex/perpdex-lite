import React from "react"
import { Heading, HeadingProps } from "@chakra-ui/react"

interface CardHeadingState extends Partial<HeadingProps> {
    text: string
}

function CardHeading({ text, ...props }: CardHeadingState) {
    return (
        <Heading w="full" size="md" color="whiteAlpha.700" {...props}>
            {text}
        </Heading>
    )
}

export default CardHeading
