import { Connection } from "container/connection"
import { metadata } from "constant"
import { useMemo } from "react"
import {
    PerpdexExchange__factory as PerpdexExchangeFactory,
    PerpdexExchange,
    PerpdexMarket__factory as PerpdexMarketFactory,
    PerpdexMarket,
    IERC20Metadata__factory as IERC20MetadataFactory,
    IERC20Metadata,
} from "types/newContracts"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { constants } from "ethers"
import { supportedChains } from "connector"
import { BaseSymbolType, QuoteSymbolType, supportedBaseSymbol, supportedQuoteSymbol } from "constant/market"

export const Contract = createContainer(useContract)

interface AddressMap {
    perpdexExchange: string
    perpdexMarket: {
        usd: string
        btc: string
        link: string
        matic: string
    }
    settlementToken: string
}

interface PerpdexMarketState {
    address: string
    symbol: BaseSymbolType
    contract: PerpdexMarket
}

interface ContractState {
    isInitialized: boolean
    perpdexExchange?: PerpdexExchange
    quoteSymbol: QuoteSymbolType
    perpdexMarket?: {
        usd: PerpdexMarketState
        btc: PerpdexMarketState
        link: PerpdexMarketState
        matic: PerpdexMarketState
    }
    ercToken?: IERC20Metadata
    ercTokenAddress: {
        settlementToken: string
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
        perpdexExchange: contracts.perpdexExchange,
        perpdexMarket: contracts.perpdexMarket,
        settlementToken: contracts.settlementToken,
    }
}

const getQuoteSymbol = (chinId: number) => {
    switch (chinId) {
        case supportedChains.Ethereum:
            return supportedQuoteSymbol.eth
        case supportedChains.Rinkeby:
            return supportedQuoteSymbol.eth
        default:
            // FIX: support ASTR
            console.error("Unsupported quote symbol")
            break
    }
}

const defaultContractInstance: ContractState = {
    isInitialized: false,
    quoteSymbol: supportedQuoteSymbol.eth as QuoteSymbolType,
    perpdexExchange: undefined,
    perpdexMarket: undefined,
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

        const contractAddress = getAddressFromChainId(chainId)
        if (!contractAddress) return defaultContractInstance

        const quoteSymbol = getQuoteSymbol(chainId)

        return {
            isInitialized: true,
            perpdexExchange: PerpdexExchangeFactory.connect(contractAddress.perpdexExchange, baseNetworkProvider),
            quoteSymbol: quoteSymbol,
            perpdexMarket: {
                usd: {
                    address: contractAddress.perpdexMarket.usd,
                    symbol: supportedBaseSymbol.usd,
                    contract: PerpdexMarketFactory.connect(contractAddress.perpdexMarket.usd, baseNetworkProvider),
                },
                btc: {
                    address: contractAddress.perpdexMarket.btc,
                    symbol: supportedBaseSymbol.btc,
                    contract: PerpdexMarketFactory.connect(contractAddress.perpdexMarket.btc, baseNetworkProvider),
                },
                link: {
                    address: contractAddress.perpdexMarket.link,
                    symbol: supportedBaseSymbol.link,
                    contract: PerpdexMarketFactory.connect(contractAddress.perpdexMarket.link, baseNetworkProvider),
                },
                matic: {
                    address: contractAddress.perpdexMarket.matic,
                    symbol: supportedBaseSymbol.matic,
                    contract: PerpdexMarketFactory.connect(contractAddress.perpdexMarket.matic, baseNetworkProvider),
                },
            },
            ercToken: IERC20MetadataFactory.connect(constants.AddressZero, baseNetworkProvider),
            ercTokenAddress: {
                settlementToken: contractAddress.settlementToken,
            },
        }
    }, [chainId, baseNetworkProvider])
}
