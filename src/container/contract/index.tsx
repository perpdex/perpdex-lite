import { Connection } from "container/connection"
import { metadata } from "constant"
import { useMemo } from "react"
import {
    TestClearingHousePerpdex__factory as TestClearingHousePerpdexFactory,
    ERC20__factory as Erc20Factory,
    TestClearingHousePerpdex,
} from "types/newContracts"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { constants } from "ethers"

export const Contract = createContainer(useContract)

interface BaseToken {
    [key: string]: string
}

interface AddressMap {
    clearingHouse: string
    quoteToken: string
    baseTokens: BaseToken[]
}

interface ContractState {
    isInitialized: boolean
    clearingHousePerpDex?: TestClearingHousePerpdex
    ercToken: string
    ercTokenAddress: {
        quoteToken: string
        baseTokens: BaseToken[]
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
        quoteToken: contracts.quoteToken,
        baseTokens: contracts.baseTokens,
    }
}

const defaultContractInstance: ContractState = {
    isInitialized: false,
    clearingHousePerpDex: undefined,
    ercToken: "",
    ercTokenAddress: {
        quoteToken: "",
        baseTokens: [],
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
            clearingHousePerpDex: TestClearingHousePerpdexFactory.connect(
                contractAddress.clearingHouse,
                baseNetworkProvider,
            ),
            ercToken: Erc20Factory.connect(constants.AddressZero, baseNetworkProvider),
            ercTokenAddress: {
                quoteToken: contractAddress.quoteToken,
                baseTokens: contractAddress.baseTokens,
            },
        }
    }, [chainId, baseNetworkProvider])
}
