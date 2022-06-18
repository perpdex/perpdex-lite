import { useState, useEffect } from "react"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"

export const Reload = createContainer(useReload)

function useReload() {
    const { account, chainId } = useWeb3React()
    const [prevChainId, setPrevChainId] = useState<number>(0)
    const [prevAccount, setPrevAccount] = useState<string>("")

    useEffect(() => {
        const chainId2 = chainId || 0
        if (prevChainId !== chainId2 && prevChainId) {
            window.location.reload()
        }
        setPrevChainId(chainId2)

        const account2 = account || ""
        if (prevAccount !== account2 && prevAccount) {
            window.location.reload()
        }
        setPrevAccount(account2)
    }, [chainId, prevChainId, account, prevAccount])

    return {}
}
