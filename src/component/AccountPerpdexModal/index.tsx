import React, { useCallback, useEffect, useState } from "react"
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
import { AccountPerpdex } from "container/account"
import { TokenPerpdex } from "container/token"
import ButtonPerpdex from "component/ButtonPerpdex"
import SmallFormLabel from "../SmallFormLabel"
import { formatInput } from "../../util/format"
import { USDC_PRECISION } from "../../constant"
import Big from "big.js"
import { Amm } from "../../container/amm"

function AccountPerpdexModal() {
    const {
        state: {
            modal: { isAccountModalOpen },
        },
        actions: { toggleAccountModal },
        getIsNeedApprove,
        deposit,
        withdraw,
        balance,
        accountValue,
    } = AccountPerpdex.useContainer()
    const { selectedAmm } = Amm.useContainer()

    const { state: tokenState } = TokenPerpdex.useContainer()

    const [amount, setAmount] = useState<string>("")
    const [bigAmount, setBigAmount] = useState<Big>(Big(0))

    const handleOnInput = useCallback(
        e => {
            const value = e.target.value
            if (value >= 0) {
                const formattedValue = formatInput(value, USDC_PRECISION)
                setAmount(formattedValue)
            }
        },
        [setAmount],
    )

    useEffect(() => {
        amount && setBigAmount(Big(amount))
    }, [amount])

    const handleOnDeposit = useCallback(async () => {
        if (bigAmount.gt(0)) {
            const isNeedApprove = await getIsNeedApprove(bigAmount)
            console.log("@@@@@ isNeedApprove", isNeedApprove)
            await deposit(bigAmount, isNeedApprove, tokenState.decimals)
        }
    }, [bigAmount, deposit, getIsNeedApprove, tokenState.decimals])

    const handleOnWithdraw = useCallback(async () => {
        if (bigAmount.gt(0)) {
            await withdraw(bigAmount)
        }
    }, [bigAmount, withdraw])

    return (
        <Modal isCentered={true} size="xs" isOpen={isAccountModalOpen} onClose={toggleAccountModal}>
            <ModalOverlay />
            <ModalContent bg="gray.800" color="gray.200">
                <ModalHeader fontWeight="400" fontSize="sm">
                    Account
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="1.5rem">
                    <Stack spacing={2}>
                        <Box>
                            Deposited balance: {balance?.toString()} {selectedAmm?.quoteAssetSymbol}
                        </Box>
                        <Box>
                            Account value: {accountValue?.toString()} {selectedAmm?.quoteAssetSymbol}
                        </Box>
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
                                            USDC
                                        </Text>
                                    </InputRightElement>
                                </InputGroup>
                            </NumberInput>
                        </FormControl>
                        <ButtonGroup>
                            <ButtonPerpdex text="Deposit" disabled={!bigAmount.gt(0)} onClick={handleOnDeposit} />
                            <ButtonPerpdex text="Withdraw" disabled={!bigAmount.gt(0)} onClick={handleOnWithdraw} />
                        </ButtonGroup>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AccountPerpdexModal
