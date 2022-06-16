import { Connection } from "container/connection"
import { useMemo } from "react"
import {
    PerpdexExchange__factory as PerpdexExchangeFactory,
    PerpdexExchange,
    IERC20Metadata__factory as IERC20MetadataFactory,
    IERC20Metadata,
} from "types/newContracts"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { constants } from "ethers"
import { QuoteSymbolType, supportedQuoteSymbol } from "constant/market"
import { networkConfigs } from "../../constant/network"
import { contractConfigs } from "../../constant/contract"

export const Contract = createContainer(useContract)

interface ContractState {
    isInitialized: boolean
    perpdexExchange?: PerpdexExchange
    quoteSymbol: QuoteSymbolType
    ercToken?: IERC20Metadata
    ercTokenAddress: {
        settlementToken: string
    }
}

const getQuoteSymbol = (chainId: number) => {
    return networkConfigs[chainId].nativeTokenSymbol
}

const defaultContractInstance: ContractState = {
    isInitialized: false,
    quoteSymbol: supportedQuoteSymbol.eth as QuoteSymbolType,
    perpdexExchange: undefined,
    ercToken: undefined,
    ercTokenAddress: {
        settlementToken: "0x00",
    },
}

function useContract() {
    const { baseNetworkProvider } = Connection.useContainer()
    const { chainId } = useWeb3React()

    return useMemo(() => {
        if (!chainId || !baseNetworkProvider) return defaultContractInstance

        const contractConfig = contractConfigs[chainId]
        if (!contractConfig) return defaultContractInstance

        const quoteSymbol = getQuoteSymbol(chainId)
        const exchange = contractConfig.exchanges[0]

        return {
            isInitialized: true,
            perpdexExchange: PerpdexExchangeFactory.connect(exchange.address, baseNetworkProvider),
            quoteSymbol: quoteSymbol,
            ercToken: IERC20MetadataFactory.connect(constants.AddressZero, baseNetworkProvider),
            ercTokenAddress: {
                settlementToken: constants.AddressZero, // TODO:
            },
        }
    }, [chainId, baseNetworkProvider])
}
