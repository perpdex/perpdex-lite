import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import { useCallback, useMemo, useState } from "react"

import Big from "big.js"
// import MyBalance from "../../component/MyBalance"
import SmallFormLabel from "component/SmallFormLabel"
import { USDC_PRECISION } from "constant"
import { formatInput } from "util/format"

interface CollateralState {
    collateralSymbol: string
    handleCollateral: (value: Big | null) => void
}

function Collateral({ collateralSymbol, handleCollateral }: CollateralState) {
    const [_collateral, _setCollateral] = useState<string>("")

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, USDC_PRECISION)
                _setCollateral(formattedValue)
                try {
                    formattedValue && handleCollateral(new Big(formattedValue))
                } catch (err) {
                    console.error(err)
                }
            }
        },
        [handleCollateral],
    )

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>COLLATERAL</SmallFormLabel>
                <NumberInput value={_collateral} onInput={handleOnInput}>
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
                                {collateralSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
                {/*<MyBalance setCollateral={_setCollateral} />*/}
            </FormControl>
        ),
        [_collateral, handleOnInput, collateralSymbol],
    )
}

export default Collateral
