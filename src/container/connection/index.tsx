import { useState, useEffect } from "react"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { Provider as MulticallProvider } from "ethers-multicall"
import { getBaseNetworkLibrary } from "connector"

export const Connection = createContainer(useConnection)

function useConnection() {
    const { account, library, active, chainId, activate, deactivate } = useWeb3React()
    const [baseNetworkProvider, setBaseNetworkProvider] = useState<Web3Provider | null>(null)
    const [multicallNetworkProvider, setMulticallNetworkProvider] = useState<MulticallProvider | null>(null)

    useEffect(() => {
        if (!chainId) return

        const baseReadOnlyProvider = getBaseNetworkLibrary(chainId)
        if (baseReadOnlyProvider) {
            setBaseNetworkProvider(baseReadOnlyProvider)

            const _multipleNetworkProvider = new MulticallProvider(baseReadOnlyProvider)
            _multipleNetworkProvider.init().then(() => {
                setMulticallNetworkProvider(_multipleNetworkProvider)
            })
        }
    }, [chainId])

    return {
        baseNetworkProvider,
        multicallNetworkProvider,
        signer: library?.getSigner() || null,
        active,
        account: account || null,
        chainId,
        activate,
        deactivate,
    }
}
