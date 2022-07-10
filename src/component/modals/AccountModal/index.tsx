import React, { useCallback, useState, useMemo } from "react"
import {
    Stack,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    Text,
    FormControl,
    Box,
    FormLabel,
    HStack,
} from "@chakra-ui/react"
import { AccountPerpdex } from "container/perpetual/account"
import Button from "component/base/Button"
import { formatInput, numberWithCommas } from "../../../util/format"
import { INPUT_PRECISION } from "../../../constant"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import Big from "big.js"
import Modal from "component/base/Modal"

function AccountModal() {
    const {
        state: {
            modal: { isAccountModalOpen, isDeposit },
        },
        actions: { closeAccountModal },
    } = AccountPerpdex.useContainer()

    const { currentMarketState } = PerpdexMarketContainer.useContainer()
    const { deposit, withdraw, currentMyAccountInfo } = PerpdexExchangeContainer.useContainer()
    const collateralBalance = currentMyAccountInfo?.collateralBalance
    const settlementTokenBalance = currentMyAccountInfo?.settlementTokenBalance

    const [amount, setAmount] = useState<string>("")

    const isEnabled = useMemo(() => {
        try {
            if (Big(amount).lte(0)) return false
            if (isDeposit) {
                if (settlementTokenBalance && Big(amount).gt(settlementTokenBalance)) return false
            } else {
                // TODO: replace with free collateral
                if (collateralBalance && Big(amount).gt(collateralBalance)) return false
            }
        } catch (err) {
            console.log(err)
            return false
        }
        return true
    }, [amount, collateralBalance, isDeposit, settlementTokenBalance])

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

    const handleSubmit = useCallback(() => {
        isDeposit ? deposit(Big(amount)) : withdraw(Big(amount))
    }, [amount, isDeposit, deposit, withdraw])

    return (
        <Modal
            headerText={isDeposit ? "Deposit" : "Withdraw"}
            isOpen={isAccountModalOpen}
            onClose={closeAccountModal}
            size="md"
            p={3}
            body={
                <Stack spacing={6} p={3}>
                    <FormControl id="margin">
                        <FormLabel>
                            <Text fontSize="sm" color="white">
                                Amount
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
                    {isDeposit ? (
                        <HStack justifyContent="space-between">
                            <Box color="rgba(255, 255, 255, 0.6)">
                                {numberWithCommas(currentMyAccountInfo?.settlementTokenBalance)} available
                            </Box>
                            <Button size="xs" customType="base-blue" text="MAX" borderRadius="5px" />
                        </HStack>
                    ) : (
                        <HStack justifyContent="space-between">
                            <Box color="rgba(255, 255, 255, 0.6)">
                                {numberWithCommas(currentMyAccountInfo?.collateralBalance)} available to withdraw
                            </Box>
                            <Button size="xs" customType="base-blue" text="MAX" borderRadius="5px" />
                        </HStack>
                    )}
                </Stack>
            }
            footer={
                <Button
                    text={isDeposit ? "Deposit" : "Withdraw"}
                    customType="base-blue"
                    onClick={handleSubmit}
                    isDisabled={!isEnabled}
                    borderRadius="0px"
                />
            }
        />
    )
}

export default AccountModal
