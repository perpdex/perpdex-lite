import {
    Text,
    NumberInput,
    InputGroup,
    NumberInputField,
    FormControl,
    FormLabel,
    InputRightElement,
    ButtonGroup,
} from "@chakra-ui/react"
import React, { useCallback, useEffect, useState } from "react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { formatInput } from "../../../util/format"
import { INPUT_PRECISION } from "../../../constant"
import Button from "component/base/Button"

function RemoveLiquidityModal() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()

    const [liquidity, setLiquidity] = useState<string>("0")

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, INPUT_PRECISION)
                setLiquidity(formattedValue)
            }
        },
        [setLiquidity],
    )

    // Reset values when market is updated
    useEffect(() => {
        if (currentMarketState.baseSymbol) {
            setLiquidity("0")
        }
    }, [currentMarketState.baseSymbol])

    return (
        <>
            <FormControl id="withdraw">
                <FormLabel>
                    <Text fontSize="md" color="white">
                        Amount to withdraw
                    </Text>
                </FormLabel>
                <NumberInput value={liquidity} onInput={handleOnInput}>
                    <InputGroup border="1px solid #353E80" borderRadius="10px">
                        <NumberInputField border="0px none" placeholder="Enter value" />
                        <InputRightElement w="54px">
                            <Text
                                w="100%"
                                textAlign="center"
                                fontWeight="bold"
                                fontSize="xs"
                                color="blue.500"
                                textTransform="uppercase"
                            >
                                {currentMarketState.quoteSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
            </FormControl>
            <ButtonGroup justifyContent="space-evenly" w="100%">
                <Button size="sm" customType="base-dark" text="25%" borderRadius="20px" onClick={() => {}} />
                <Button size="sm" customType="base-dark" text="50%" borderRadius="20px" onClick={() => {}} />
                <Button size="sm" customType="base-dark" text="75%" borderRadius="20px" onClick={() => {}} />
                <Button size="sm" customType="base-dark" text="MAX" borderRadius="20px" onClick={() => {}} />
            </ButtonGroup>
        </>
    )
}

export default RemoveLiquidityModal
