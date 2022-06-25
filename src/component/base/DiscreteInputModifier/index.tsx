import React, { useCallback, useState } from "react"
import {
    Button,
    Box,
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

interface DiscreteInputModifierState {
    inputLabel: string
    assetSymbol: string
    maxValue: Big
    handleUpdate: (value: Big) => void
}

function DiscreteInputModifier({ inputLabel, assetSymbol, maxValue, handleUpdate }: DiscreteInputModifierState) {
    const [inputValue, setInputValue] = useState<string>("")

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

    const markedValues = [10, 25, 50, 75, 100]

    return (
        <>
            <FormControl id="margin">
                <SmallFormLabel>{inputLabel}</SmallFormLabel>
                <NumberInput value={inputValue} onInput={handleOnInput}>
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
                    {markedValues.map(val => (
                        <Button
                            width={76}
                            height={30}
                            colorScheme="teal"
                            variant="ghost"
                            onClick={() => handleDiscreteUpdate(val)}
                        >
                            {val}%
                        </Button>
                    ))}
                </Stack>
            </Box>
        </>
    )
}

export default DiscreteInputModifier
