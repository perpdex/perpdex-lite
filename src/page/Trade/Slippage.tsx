import {
    FormControl,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    InputRightElement,
    Text,
    Button,
    ButtonGroup,
    Heading,
} from "@chakra-ui/react"
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
                        color="white"
                        bgColor="#353E80"
                        borderRadius="10px"
                        onClick={() => {
                            setSlippage(5)
                        }}
                    >
                        5.0%
                    </Button>
                    <ButtonGroup>
                        <Button
                            size="xs"
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                setSlippage(0.5)
                            }}
                        >
                            0.5%
                        </Button>
                        <Button
                            size="xs"
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                setSlippage(1)
                            }}
                        >
                            1.0%
                        </Button>
                        <Button
                            size="xs"
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                setSlippage(2)
                            }}
                        >
                            2.0%
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>
            </FormControl>
        ),
        [handleOnChange, slippage],
    )
}

export default Slippage
