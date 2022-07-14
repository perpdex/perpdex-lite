import React, { useCallback, useEffect, useState } from "react"
import {
    Box,
    ButtonGroup,
    Stack,
    FormControl,
    InputGroup,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Text,
} from "@chakra-ui/react"
import SmallFormLabel from "../SmallFormLabel"
import { formatInput } from "util/format"
import Big from "big.js"
import Button from "../Button"

interface DiscreteInputModifierState {
    inputLabel?: string
    assetSymbol: string
    value?: Big
    maxValue: Big
    discreteValues?: number[]
    handleUpdate: (value: Big) => void
    uiType?: "simple" | "white-base"
}

function DiscreteInputModifier({
    inputLabel,
    assetSymbol,
    value,
    maxValue,
    discreteValues = [25, 50, 75, 100],
    handleUpdate,
    uiType,
}: DiscreteInputModifierState) {
    const [inputValue, setInputValue] = useState<string>("")

    useEffect(() => {
        if (!value) {
            setInputValue("")
        }
    }, [value])

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, 18)
                setInputValue(formattedValue)

                try {
                    formattedValue && handleUpdate(new Big(formattedValue))
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [handleUpdate],
    )

    const handleDiscreteUpdate = useCallback(
        (percent: number) => {
            const nextValue = maxValue.mul(percent).div(100)
            setInputValue(nextValue.toFixed(6))
            handleUpdate(nextValue)
        },
        [handleUpdate, maxValue],
    )

    // const markedValues = [10, 25, 50, 75, 100]

    if (uiType === "simple") {
        return (
            <>
                <FormControl id="margin">
                    <SmallFormLabel>{inputLabel}</SmallFormLabel>
                    <NumberInput value={inputValue!!} onInput={handleOnInput}>
                        <InputGroup>
                            <NumberInputField />
                            <InputRightElement w="54px">
                                <Text
                                    w="100%"
                                    textAlign="center"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    color="blue.500"
                                    textTransform="uppercase"
                                >
                                    {assetSymbol}
                                </Text>
                            </InputRightElement>
                        </InputGroup>
                    </NumberInput>
                </FormControl>

                <Box py={2}>
                    <Stack backgroundColor="whiteAlpha.200" direction="row" spacing={1} align="center">
                        {discreteValues.map(val => (
                            <Button
                                customType="rectangle-teal"
                                text={val.toString() + "%"}
                                width={76}
                                height={30}
                                onClick={() => handleDiscreteUpdate(val)}
                            />
                        ))}
                    </Stack>
                </Box>
            </>
        )
    }

    return (
        <>
            <NumberInput value={inputValue} onInput={handleOnInput} w="100%">
                <NumberInputField />
                <InputRightElement w={assetSymbol.length > 6 ? "90px" : "54px"}>
                    <Text
                        w="100%"
                        textAlign="center"
                        fontWeight="bold"
                        fontSize="xs"
                        color="blue.500"
                        textTransform="uppercase"
                    >
                        {assetSymbol}
                    </Text>
                </InputRightElement>
            </NumberInput>
            <ButtonGroup>
                {discreteValues.map(val => (
                    <Button
                        text={val === 100 ? "MAX" : val.toString() + "%"}
                        customType="outline-white"
                        onClick={() => handleDiscreteUpdate(val)}
                    />
                ))}
            </ButtonGroup>
        </>
    )
}

export default DiscreteInputModifier
