import React from "react"
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
} from "@chakra-ui/react"
import { AccountPerpdex } from "container/account"
import ButtonPerpdex from "component/ButtonPerpdex"

function AccountPerpdexModal() {
    const {
        state: {
            modal: { isAccountModalOpen },
        },
        actions: { toggleAccountModal },
    } = AccountPerpdex.useContainer()

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
                        <ButtonGroup>
                            <ButtonPerpdex text="Deposit" />
                            <ButtonPerpdex text="Withdraw" />
                        </ButtonGroup>
                    </Stack>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default AccountPerpdexModal
