import React, { useCallback, useState } from "react"
import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Button,
    ButtonGroup,
    NumberInput,
    InputGroup,
    NumberInputField,
    InputRightElement,
    Text,
    FormControl,
} from "@chakra-ui/react"
import { AccountPerpdex } from "container/account"
import ButtonPerpdex from "component/ButtonPerpdex"
import SmallFormLabel from "../SmallFormLabel"
import { formatInput } from "../../util/format"
import { Side, USDC_PRECISION } from "../../constant"
import { isAddress } from "ethers/lib/utils"
import Big from "big.js"

function AccountPerpdexModal() {
    const {
        state: {
            modal: { isAccountModalOpen },
        },
        actions: { toggleAccountModal },
        deposit,
        withdraw,
    } = AccountPerpdex.useContainer()

    const [amount, setAmount] = useState<string>("")

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

    const handleOnDeposit = useCallback(async () => {
        const amountNum = Big(amount)
        if (amountNum.gt(0)) {
            await deposit(amountNum)
        }
    }, [deposit, amount])

    const handleOnWithdraw = useCallback(async () => {
        const amountNum = Big(amount)
        if (amountNum.gt(0)) {
            await withdraw(amountNum)
        }
    }, [withdraw, amount])

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
                            <ButtonPerpdex text="Deposit" onClick={handleOnDeposit} />
                            <ButtonPerpdex text="Withdraw" onClick={handleOnWithdraw} />
                        </ButtonGroup>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AccountPerpdexModal
