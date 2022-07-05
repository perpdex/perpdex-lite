import {
    FormControl,
    NumberInput,
    NumberInputField,
    InputRightElement,
    Text,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverBody,
    HStack,
    Button,
} from "@chakra-ui/react"
import React, { useCallback, useMemo } from "react"

import SmallFormLabel from "component/base/SmallFormLabel"
import { Trade } from "container/perpetual/trade"
import { QuestionOutlineIcon } from "@chakra-ui/icons"

// TODO: separate component and state
function Slippage() {
    const { slippage, setSlippage } = Trade.useContainer()

    const handleOnChange = useCallback(
        value => {
            if (value >= 0) {
                setSlippage(value)
            }
        },
        [setSlippage],
    )
    const handleOnClick = useCallback(
        value => {
            setSlippage(value)
        },
        [setSlippage],
    )
    return useMemo(
        () => (
            <FormControl id="slippage" mb="4">
                <SmallFormLabel>
                    Slippage Tolerance{" "}
                    <Popover trigger="hover">
                        <PopoverTrigger>
                            <QuestionOutlineIcon></QuestionOutlineIcon>
                        </PopoverTrigger>
                        <PopoverContent>
                            <PopoverBody>
                                Your transaction will revert if the price changes unfavorably by more than this
                                percentage
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                </SmallFormLabel>
                <HStack justifyContent="left">
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
                        <InputRightElement w="54px">
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
                    <HStack>
                        <Button size="xs" onClick={() => handleOnClick(1)}>
                            1%
                        </Button>
                        <Button size="xs" onClick={() => handleOnClick(1.5)}>
                            1.5%
                        </Button>
                        <Button size="xs" onClick={() => handleOnClick(2)}>
                            2%
                        </Button>
                    </HStack>
                </HStack>
            </FormControl>
        ),
        [handleOnChange, slippage, handleOnClick],
    )
}

export default Slippage
