import {
    FormControl,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    InputRightElement,
    Text,
    ButtonGroup,
    Heading,
} from "@chakra-ui/react"
import Button from "../../component/base/Button"
import React, { useCallback, useMemo } from "react"

interface SlippageState {
    slippage: number
    setSlippage: (value: number) => void
}

function Slippage({ slippage, setSlippage }: SlippageState) {
    const handleOnChange = useCallback(
        value => {
            if (value >= 0) {
                setSlippage(value)
            }
        },
        [setSlippage],
    )
    return useMemo(
        () => (
            <FormControl id="slippage">
                <Heading w="full" size="md" mb={8}>
                    Slippage
                </Heading>
                <NumberInput
                    allowMouseWheel
                    min={0}
                    step={0.1}
                    max={100}
                    clampValueOnBlur={false}
                    onChange={handleOnChange}
                    value={slippage}
                    focusInputOnChange={true}
                >
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                    <InputRightElement w="54px" mr={4}>
                        <Text
                            w="100%"
                            textAlign="center"
                            fontWeight="bold"
                            fontSize="xs"
                            color="gray.500"
                            textTransform="uppercase"
                        >
                            %
                        </Text>
                    </InputRightElement>
                </NumberInput>
                <ButtonGroup w="100%" justifyContent={"space-between"} mt={8}>
                    <Button
                        size="xs"
                        customType="base-blue"
                        text="5.0%"
                        borderRadius="5px"
                        onClick={() => {
                            setSlippage(5)
                        }}
                    />
                    <ButtonGroup>
                        <Button
                            size="xs"
                            customType="base-dark"
                            text="0.5%"
                            borderRadius="5px"
                            onClick={() => {
                                setSlippage(0.5)
                            }}
                        />
                        <Button
                            size="xs"
                            customType="base-dark"
                            text="1.0%"
                            borderRadius="5px"
                            onClick={() => {
                                setSlippage(1)
                            }}
                        />
                        <Button
                            size="xs"
                            customType="base-dark"
                            text="2.0%"
                            borderRadius="5px"
                            onClick={() => {
                                setSlippage(2)
                            }}
                        />
                    </ButtonGroup>
                </ButtonGroup>
            </FormControl>
        ),
        [handleOnChange, setSlippage, slippage],
    )
}

export default Slippage
