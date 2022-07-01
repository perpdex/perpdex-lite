import { FormControl, InputGroup, InputRightElement, NumberInput, NumberInputField, Text } from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"

import Big from "big.js"
import SmallFormLabel from "component/base/SmallFormLabel"
import { BIG_ZERO, USDC_PRECISION } from "constant"
import { formatInput } from "util/format"
import { LpCollateralState, MarketState } from "constant/types"

interface CollateralState {
    currentMarketState: MarketState
    collateralValues: LpCollateralState
    setCollateralValues: (value: LpCollateralState) => void
}

function Collateral({ currentMarketState, collateralValues, setCollateralValues }: CollateralState) {
    const [baseValue, setBaseValue] = useState<string>("")
    const [quoteValue, setQuoteValue] = useState<string>("")

    const handleOnInput = useCallback(
        (isBase, value) => {
            if (value >= 0) {
                try {
                    const newValue = formatInput(value, USDC_PRECISION)
                    isBase ? setBaseValue(newValue) : setQuoteValue(newValue)

                    let base
                    let quote

                    if (currentMarketState.markPrice.eq(0)) {
                        if (isBase) {
                            base = Big(value)
                            quote = Big(quoteValue)
                        } else {
                            quote = Big(value)
                            base = Big(baseValue)
                        }
                    } else {
                        if (isBase) {
                            base = Big(value)
                            quote = base.mul(currentMarketState.markPrice)
                        } else {
                            quote = Big(value)
                            base = quote.div(currentMarketState.markPrice)
                        }

                        isBase ? setQuoteValue(quote.toString()) : setBaseValue(base.toString())
                    }

                    setCollateralValues({
                        base,
                        quote,
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        },
        [setCollateralValues, currentMarketState.markPrice, baseValue, quoteValue],
    )

    useEffect(() => {
        if (collateralValues.base === BIG_ZERO && collateralValues.quote === BIG_ZERO) {
            setBaseValue("")
            setQuoteValue("")
        }
    }, [collateralValues.base, collateralValues.quote])

    const handleOnBaseInput = useCallback(e => handleOnInput(true, e.target.value), [handleOnInput])
    const handleOnQuoteInput = useCallback(e => handleOnInput(false, e.target.value), [handleOnInput])

    return useMemo(
        () => (
            <FormControl id="margin">
                <SmallFormLabel>COLLATERAL</SmallFormLabel>
                <NumberInput value={baseValue} onInput={handleOnBaseInput}>
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
                                {currentMarketState.baseSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
                <NumberInput value={quoteValue} onInput={handleOnQuoteInput}>
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
                                {currentMarketState.quoteSymbol}
                            </Text>
                        </InputRightElement>
                    </InputGroup>
                </NumberInput>
            </FormControl>
        ),
        [
            baseValue,
            currentMarketState.baseSymbol,
            currentMarketState.quoteSymbol,
            handleOnBaseInput,
            handleOnQuoteInput,
            quoteValue,
        ],
    )
}

export default Collateral
