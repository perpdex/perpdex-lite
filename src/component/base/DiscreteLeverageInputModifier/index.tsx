import React from "react"
import { ButtonGroup } from "@chakra-ui/react"
import Button from "../Button"

interface DiscreteInputModifierState {
    maxValue?: number
    handleUpdate: (value: number) => void
}

interface ButtonState {
    text: string
    value: number
}

function DiscreteLeverageInputModifier({ maxValue, handleUpdate }: DiscreteInputModifierState) {
    const buttonStates: ButtonState[] = [
        {
            text: "1.0x",
            value: 1,
        },
        {
            text: "2.0x",
            value: 2,
        },
        {
            text: "3.0x",
            value: 3,
        },
        {
            text: "Max",
            value: maxValue ? maxValue : 10,
        },
    ]

    const SideButton = ({ text, value }: ButtonState) => (
        <Button
            size="xs"
            customType="base-dark"
            text={text}
            borderRadius="5px"
            onClick={() => {
                handleUpdate(value)
            }}
        />
    )

    return (
        <>
            <ButtonGroup w="100%" justifyContent={"space-between"}>
                <Button
                    size="xs"
                    customType="base-blue"
                    text="5.0x"
                    borderRadius="5px"
                    onClick={() => {
                        handleUpdate(5)
                    }}
                />
                <ButtonGroup>
                    {buttonStates.map((states: ButtonState) => (
                        <SideButton text={states.text} value={states.value} />
                    ))}
                </ButtonGroup>
            </ButtonGroup>
        </>
    )
}

export default DiscreteLeverageInputModifier
