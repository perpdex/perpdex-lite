import {
    FormControl,
    FormLabel,
    HStack,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Text,
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"

import Big from "big.js"
import { BIG_ZERO, USDC_PRECISION } from "constant"
import { formatInput, formattedNumberWithCommas } from "util/format"
import Slider from "component/base/Slider"
import DiscreteLeverageInputModifier from "component/base/DiscreteLeverageInputModifier"

interface PositionInputState {
    baseSymbol: string
    quoteSymbol: string
    baseOrderValue: Big
    markPrice: Big
    maxCollateral: Big
    handleBasePositionInput: (value: Big | null) => void
}

function PositionInput({
    baseSymbol,
    quoteSymbol,
    baseOrderValue,
    markPrice,
    maxCollateral,
    handleBasePositionInput,
}: PositionInputState) {
    const [baseString, setBaseString] = useState<string>("")
    const [quoteString, setQuoteString] = useState<string>("")
    const [leverage, setLeverage] = useState<number>(1)

    useEffect(() => {
        if (baseOrderValue && baseOrderValue === BIG_ZERO) {
            setBaseString("")
            setQuoteString("")
            setLeverage(1)
        }
    }, [baseOrderValue])

    const handleOnInput = useCallback(
        (e, isInputBase) => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, USDC_PRECISION)

                isInputBase ? setBaseString(formattedValue) : setQuoteString(formattedValue)
                try {
                    if (formattedValue && !markPrice.eq(0)) {
                        const inputValue = new Big(formattedValue)
                        const oppositeValue = isInputBase ? inputValue.mul(markPrice) : inputValue.div(markPrice)

                        isInputBase
                            ? setQuoteString(formattedNumberWithCommas(oppositeValue, 5))
                            : setBaseString(formattedNumberWithCommas(oppositeValue, 5))
                        handleBasePositionInput(isInputBase ? inputValue : oppositeValue)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [handleBasePositionInput, markPrice],
    )

    const handleLeverageUpdate = useCallback(
        (value: number) => {
            if (value !== leverage && !markPrice.eq(0) && maxCollateral) {
                setLeverage(value)

                const quoteValue = maxCollateral.mul(value)
                const baseValue = quoteValue.div(markPrice)
                handleBasePositionInput(baseValue)
                setBaseString(formattedNumberWithCommas(baseValue, 5))
                setQuoteString(formattedNumberWithCommas(quoteValue, 5))
            }
        },
        [handleBasePositionInput, leverage, markPrice, maxCollateral],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <FormLabel>
                    <Text fontSize="md" color="white">
                        Collateral
                    </Text>
                </FormLabel>
                <HStack>
                    <NumberInput value={baseString} onInput={e => handleOnInput(e, true)}>
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
                                {baseSymbol}
                            </Text>
                        </InputRightElement>
                    </NumberInput>
                    <Text fontSize="3xl" ml={2}>
                        /
                    </Text>
                    <NumberInput value={quoteString} onInput={e => handleOnInput(e, false)}>
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
                                {quoteSymbol}
                            </Text>
                        </InputRightElement>
                    </NumberInput>
                </HStack>
                <Text fontSize="md" color="white" mt="4">
                    Leverage
                </Text>
                <Slider currentValue={leverage} handleUpdate={handleLeverageUpdate} />
                <DiscreteLeverageInputModifier handleUpdate={handleLeverageUpdate} />
            </FormControl>
        ),
        [baseString, handleOnInput, baseSymbol, quoteString, quoteSymbol, leverage, handleLeverageUpdate],
    )
}

export default PositionInput
