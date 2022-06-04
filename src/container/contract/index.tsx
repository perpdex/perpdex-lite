import { Connection } from "container/connection"
import { metadata } from "constant"
import { useMemo } from "react"
import {
    PerpdexExchange__factory as PerpdexExchangeFactory,
    PerpdexExchange,
    ERC20__factory as Erc20Factory,
    ERC20,
} from "types/newContracts"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { constants } from "ethers"

export const Contract = createContainer(useContract)

interface BaseToken {
    usd: string
}

interface AddressMap {
    clearingHouse: string
    settlementToken: string
    quoteToken: string
    baseTokens: BaseToken
}

interface ContractState {
    isInitialized: boolean
    perpdexExchange?: PerpdexExchange
    ercToken?: ERC20
    ercTokenAddress: {
        settlementToken: string
        quoteToken: string
        baseTokens: BaseToken
    }
}

function getAddressFromChainId(chainId: number): AddressMap | undefined {
    const layer2 = metadata.staging.layers.layer2 // TODO handle stag for both prod and staging
    const networks = layer2.networks

    const contracts = networks.find(n => n.chainId === chainId)?.contracts

    if (!contracts) {
        console.log("This nework is not supported")
        return
    }

    return {
        clearingHouse: contracts.clearingHouse,
        settlementToken: contracts.settlementToken,
        quoteToken: contracts.quoteToken,
        baseTokens: contracts.baseTokens,
    }
}

const defaultContractInstance: ContractState = {
    isInitialized: false,
    perpdexExchange: undefined,
    ercToken: undefined,
    ercTokenAddress: {
        settlementToken: "",
        quoteToken: "",
        baseTokens: {
            usd: "",
        },
    },
}

function useContract() {
    const { baseNetworkProvider } = Connection.useContainer()
    const { chainId } = useWeb3React()

    return useMemo(() => {
        if (!chainId || !baseNetworkProvider) return defaultContractInstance

        const contractAddress = getAddressFromChainId(chainId)
        if (!contractAddress) return defaultContractInstance

        return {
            isInitialized: true,
            perpdexExchange: PerpdexExchangeFactory.connect(contractAddress.clearingHouse, baseNetworkProvider),
            ercToken: Erc20Factory.connect(constants.AddressZero, baseNetworkProvider),
            ercTokenAddress: {
                settlementToken: contractAddress.settlementToken,
                quoteToken: contractAddress.quoteToken,
                baseTokens: contractAddress.baseTokens,
            },
        }
    }, [chainId, baseNetworkProvider])
}
