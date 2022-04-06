import { useState, useEffect } from "react"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { Web3Provider } from "@ethersproject/providers"
import { Provider as MulticallProvider } from "ethers-multicall"
import { getEthereumNetworkLibrary, getBaseNetworkLibrary } from "connector"

export const Connection = createContainer(useConnection)

// The ethereum provider is needed all the time
const ethProvider = getEthereumNetworkLibrary()

function useConnection() {
    const { account, library, active, chainId } = useWeb3React()
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
        ethProvider,
        baseNetworkProvider,
        multicallNetworkProvider,
        signer: library?.getSigner() || null,
        active,
        account: account || null,
        chainId,
    }
}
