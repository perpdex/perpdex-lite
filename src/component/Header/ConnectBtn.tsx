import React from "react"
import { Button } from "@chakra-ui/react"
import WalletFill from "../Icon/WalletFill"
import { Global } from "container/global"
import { getShortenAccount } from "util/getShortenAddress"
import { User } from "container/user"
import { NewContract } from "container/newContract"

function ConnectBtn() {
    const {
        state: { address },
    } = User.useContainer()

    const { isInitialized, clearingHouseConfig } = NewContract.useContainer()

    console.log("This is the test of the existence of contracts", isInitialized, clearingHouseConfig)

    const {
        actions: { toggleWalletModal },
    } = Global.useContainer()

    return (
        <Button
            size="sm"
            onClick={toggleWalletModal}
            colorScheme="gray"
            variant="outline"
            leftIcon={<WalletFill boxSize={4} />}
        >
            {address ? getShortenAccount(address) : "Connect"}
        </Button>
    )
}

export default ConnectBtn
