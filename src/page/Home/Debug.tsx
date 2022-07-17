import {
    Box,
    FormControl,
    FormLabel,
    Heading,
    InputGroup,
    InputRightElement,
    NumberInput,
    NumberInputField,
    Stack,
    Text,
} from "@chakra-ui/react"
import { formatInput } from "../../util/format"
import Button from "../../component/base/Button"
import React, { useCallback, useState } from "react"
import { INPUT_PRECISION } from "../../constant"
import Big from "big.js"
import { PerpdexExchangeContainer } from "../../container/connection/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"

function Debug() {
    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { setCollateralBalance } = PerpdexExchangeContainer.useContainer()
    const [amount, setAmount] = useState<string>("")

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, INPUT_PRECISION)
                setAmount(formattedValue)
            }
        },
        [setAmount],
    )

    const handleSubmit = useCallback(async () => {
        await setCollateralBalance(Big(amount))
    }, [setCollateralBalance, amount])

    return (
        <Box w="80%" paddingTop={4}>
            <Heading size="lg">Debug (for testnet)</Heading>

            <Stack spacing={6} p={3}>
                <FormControl id="margin">
                    <FormLabel>
                        <Text fontSize="sm" color="white">
                            Collateral Balance
                        </Text>
                    </FormLabel>
                    <NumberInput value={amount} onInput={handleOnInput}>
                        <InputGroup>
                            <NumberInputField placeholder="1" />
                            <InputRightElement w="54px">
                                <Text
                                    w="100%"
                                    textAlign="center"
                                    fontWeight="bold"
                                    fontSize="xs"
                                    color="white"
                                    textTransform="uppercase"
                                >
                                    {currentMarketState?.quoteSymbol}
                                </Text>
                            </InputRightElement>
                        </InputGroup>
                    </NumberInput>
                </FormControl>
                <Button text="setCollateralBalance" customType="base-blue" onClick={handleSubmit} />
            </Stack>
        </Box>
    )
}

export default Debug
