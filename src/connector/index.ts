import { Web3Provider } from "@ethersproject/providers"
import { IS_MAINNET } from "../constant/stage"
import { InjectedConnector } from "@web3-react/injected-connector"
import { NetworkConnector } from "@web3-react/network-connector"
import { providers } from "ethers"
import { isWebsocket } from "util/is"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
import { networkConfigs } from "../constant/network"
import _ from "lodash"

// import { WalletLinkConnector } from '@web3-react/walletlink-connector'
// import { LedgerConnector } from '@web3-react/ledger-connector'
// import { TrezorConnector } from '@web3-react/trezor-connector'
// import { LatticeConnector } from '@web3-react/lattice-connector'
// import { FrameConnector } from '@web3-react/frame-connector'
// import { AuthereumConnector } from '@web3-react/authereum-connector'
// import { FortmaticConnector } from '@web3-react/fortmatic-connector'
// import { MagicConnector } from '@web3-react/magic-connector'
// import { PortisConnector } from '@web3-react/portis-connector'
// import { TorusConnector } from '@web3-react/torus-connector'

const RPC_URLS = _.mapValues(networkConfigs, "rpcUrl")

console.log(networkConfigs)
console.log(RPC_URLS)
console.log(_.min(_.map(_.keys(networkConfigs), _.toNumber)))

export const network = new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: _.min(_.map(_.keys(networkConfigs), _.toNumber)),
})

export function validateSupportedChainId(chainId: number) {
    return !!networkConfigs[chainId]
}

// TODO: remove
export function getEthereumNetworkLibrary(): Web3Provider {
    const chainId = IS_MAINNET ? 1 : 4
    const rpcUrl = RPC_URLS[chainId]!
    if (isWebsocket(rpcUrl)) {
        return (new providers.WebSocketProvider(rpcUrl, chainId) as unknown) as Web3Provider
    } else {
        return (new providers.JsonRpcProvider(rpcUrl, chainId) as unknown) as Web3Provider
    }
}

export function getBaseNetworkLibrary(chainId: number): Web3Provider | undefined {
    if (validateSupportedChainId(chainId)) {
        const rpcUrl = RPC_URLS[chainId]
        if (isWebsocket(rpcUrl)) {
            return (new providers.WebSocketProvider(rpcUrl, chainId) as unknown) as Web3Provider
        } else {
            return (new providers.JsonRpcProvider(rpcUrl, chainId) as unknown) as Web3Provider
        }
    } else {
        console.log("This network is not supported")
    }
}

// see all chain ids in https://chainid.network/
export const injected = new InjectedConnector({
    supportedChainIds: _.map(_.keys(networkConfigs), _.toNumber),
})

export const walletConnect = new WalletConnectConnector({
    // TODO: multiple rpc urls
    rpc: { [_.keys(RPC_URLS)[0]]: _.values(RPC_URLS)[0] },
    pollingInterval: 15000,
})
