import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import { useCallback, useMemo, useState } from "react"

import Big from "big.js"
import SmallFormLabel from "component/SmallFormLabel"
import { USDC_PRECISION } from "constant"
import { formatInput } from "util/format"

interface PositionInputState {
    baseSymbol: string
    handleInput: (value: Big | null) => void
}

function PositionInput({ baseSymbol, handleInput }: PositionInputState) {
    const [position, setPosition] = useState<string>("")

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, USDC_PRECISION)
                setPosition(formattedValue)
                try {
                    formattedValue && handleInput(new Big(formattedValue))
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [handleInput],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>Order by Qty</SmallFormLabel>
                <NumberInput value={position} onInput={handleOnInput}>
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
                                {baseSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
            </FormControl>
        ),
        [position, handleOnInput, baseSymbol],
    )
}

export default PositionInput
