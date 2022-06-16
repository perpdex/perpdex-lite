import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import { useCallback, useMemo, useState } from "react"

import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import Big from "big.js"
import SmallFormLabel from "component/SmallFormLabel"
import { USDC_PRECISION } from "constant"
import { formatInput } from "util/format"

interface ICollateral {
    onChange?: (value: Big) => void
}

function Collateral({ onChange }: ICollateral) {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const [collateral, setCollateral] = useState<string>("")

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, USDC_PRECISION)
                console.log("for", formattedValue)
                setCollateral(formattedValue)
                if (onChange) {
                    try {
                        onChange(Big(value))
                    } catch (err) {
                        console.log(err)
                    }
                }
            }
        },
        [setCollateral, onChange],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>COLLATERAL</SmallFormLabel>
                <NumberInput value={collateral} onInput={handleOnInput}>
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
                                {currentMarketState?.quoteSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
            </FormControl>
        ),
        [collateral, currentMarketState?.quoteSymbol, handleOnInput],
    )
}

export default Collateral
