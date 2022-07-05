import React from "react"
import { Stack } from "@chakra-ui/react"
import WalletButton from "./WalletButton"
import DisconnectButton from "./DisconnectButton"
import { WalletInfo, SUPPORTED_WALLETS } from "../../constant/wallet"
import { User } from "container/connection/user"
import { Modal as ModalContainer } from "container/modal"
import Modal from "component/base/Modal"

function WalletListModal() {
    const {
        state: { address },
    } = User.useContainer()

    const {
        walletModalIsOpen,
        actions: { toggleWalletModal },
    } = ModalContainer.useContainer()

    return (
        <Modal
            headerText="Connect Wallet"
            isOpen={walletModalIsOpen}
            onClose={toggleWalletModal}
            body={
                <Stack spacing={2}>
                    {SUPPORTED_WALLETS.map((value: WalletInfo) => {
                        return (
                            <WalletButton
                                key={value.id}
                                id={value.id}
                                name={value.name}
                                connector={value.connector}
                                src={require(`../../asset/wallet/${value.iconName}`).default}
                            />
                        )
                    })}
                    {address && <DisconnectButton />}
                </Stack>
            }
        />
    )
}

export default WalletListModal
