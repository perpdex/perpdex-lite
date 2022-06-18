import React, { useEffect } from "react"
import { Button } from "@chakra-ui/react"
import { User } from "container/connection/user"
import { AccountPerpdex } from "container/connection/account"
import WalletFill from "../../component/Icon/WalletFill"

function AssetInfo() {
    const {
        state: { address },
    } = User.useContainer()

    const {
        actions: { openAccountModal, getBalance },
    } = AccountPerpdex.useContainer()

    useEffect(() => {
        getBalance()
    }, [getBalance])

    const AssetInfoButton = (isDeposit: boolean) => (
        <Button
            size="sm"
            onClick={() => openAccountModal(isDeposit)}
            colorScheme="gray"
            variant="outline"
            leftIcon={<WalletFill boxSize={4} />}
        >
            {isDeposit ? "Deposit" : "Withdraw"}
        </Button>
    )

    return (
        <>
            {address && (
                <>
                    {AssetInfoButton(true)}
                    {AssetInfoButton(false)}
                </>
            )}
        </>
    )
}

export default AssetInfo
