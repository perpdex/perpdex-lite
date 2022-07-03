import React, { useCallback, useState, useMemo } from "react"
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    ButtonGroup,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    Text,
    FormControl,
    Box,
} from "@chakra-ui/react"
import { AccountPerpdex } from "container/perpetual/account"
import ButtonPerpdex from "component/base/Button"
import SmallFormLabel from "../base/SmallFormLabel"
import { formatInput, numberWithCommas } from "../../util/format"
import { INPUT_PRECISION } from "../../constant"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import Big from "big.js"

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
    }, [amount, isDeposit])

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
        <Modal isCentered={true} size="xs" isOpen={isAccountModalOpen} onClose={closeAccountModal}>
            <ModalOverlay />
            <ModalContent bg="gray.800" color="gray.200">
                <ModalHeader fontWeight="400" fontSize="sm">
                    {isDeposit ? "Deposit" : "Withdraw"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="1.5rem">
                    <Stack spacing={2}>
                        <FormControl id="margin">
                            <SmallFormLabel>Amount</SmallFormLabel>
                            <NumberInput value={amount} onInput={handleOnInput}>
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
                        {isDeposit ? (
                            <Box>{numberWithCommas(currentMyAccountInfo?.settlementTokenBalance)} available</Box>
                        ) : (
                            <Box>{numberWithCommas(currentMyAccountInfo?.collateralBalance)} available to withdraw</Box>
                        )}
                        <ButtonGroup>
                            <ButtonPerpdex
                                text={isDeposit ? "Deposit" : "Withdraw"}
                                onClick={handleSubmit}
                                isDisabled={!isEnabled}
                            />
                        </ButtonGroup>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AccountModal
