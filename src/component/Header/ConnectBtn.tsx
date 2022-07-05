import React from "react"
import WalletFill from "../Icon/WalletFill"
import { Modal } from "container/modal"
import { getShortenAccount } from "util/getShortenAddress"
import { User } from "container/connection/user"
import Button from "component/base/Button"

function ConnectBtn() {
    const {
        state: { address },
    } = User.useContainer()

    const {
        actions: { toggleWalletModal },
    } = Modal.useContainer()

    return (
        <Button
            text={address ? getShortenAccount(address) : "Connect"}
            customType="base-dark"
            size="sm"
            onClick={toggleWalletModal}
            leftIcon={<WalletFill boxSize={4} />}
            mr="4"
        />
    )
}

export default ConnectBtn
