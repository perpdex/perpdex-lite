import { Web3Provider } from "@ethersproject/providers"
import { IS_MAINNET } from "../constant/stage"
import { InjectedConnector } from "@web3-react/injected-connector"
import { NetworkConnector } from "@web3-react/network-connector"
import { providers } from "ethers"
import { isWebsocket } from "util/is"
import { WalletConnectConnector } from "@web3-react/walletconnect-connector"
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

export const supportedChains = {
    Ethereum: 1,
    Rinkeby: 4,
    XDai: 100,
    Mumbai: 80001,
}

// the app cannot connect to network where contracts are not deployed
const deployedChains = [supportedChains.XDai]

export const supportedChainIds = Object.values(supportedChains)

const {
    REACT_APP_MAINNET_RPC_URL,
    REACT_APP_RINKEBY_RPC_URL,
    REACT_APP_XDAI_RPC_URL,
    REACT_APP_MUMBAI_RPC_URL,
} = process.env

const RPC_URLS = {
    [supportedChains.Ethereum]: REACT_APP_MAINNET_RPC_URL!,
    [supportedChains.Rinkeby]: REACT_APP_RINKEBY_RPC_URL!,
    [supportedChains.XDai]: REACT_APP_XDAI_RPC_URL!,
    [supportedChains.Mumbai]: REACT_APP_MUMBAI_RPC_URL!,
}

export const network = new NetworkConnector({
    urls: RPC_URLS,
    defaultChainId: IS_MAINNET ? supportedChains.Ethereum : supportedChains.Rinkeby,
})

export function validateSupportedChainId(chainId: number) {
    return deployedChains.includes(chainId)
}

export function getEthereumNetworkLibrary(): Web3Provider {
    const chainId = IS_MAINNET ? supportedChains.Ethereum : supportedChains.Rinkeby
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
    supportedChainIds: [
        supportedChains.Ethereum,
        supportedChains.Rinkeby,
        supportedChains.XDai,
        supportedChains.Mumbai,
    ],
})

export const walletConnect = new WalletConnectConnector({
    rpc: IS_MAINNET
        ? {
              [supportedChains.Ethereum]: RPC_URLS[supportedChains.Ethereum],
          }
        : { [supportedChains.Rinkeby]: RPC_URLS[supportedChains.Rinkeby] },
    pollingInterval: 15000,
})

export class LedgerProvider {}
