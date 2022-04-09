import { Connection } from "container/connection"
import { metadata } from "constant"
import { useMemo } from "react"
import {
    ERC20__factory as Erc20Factory,
    UniswapV2Factory__factory as UniswapV2FactoryFactory,
    ClearingHouseConfig__factory as ClearingHouseConfigFactory,
    MarketRegistry__factory as MarketRegistryFactory,
    OrderBook__factory as OrderBookFactory,
    AccountBalance__factory as AccountBalanceFactory,
    Exchange__factory as ExchangeFactory,
    InsuranceFund__factory as InsuranceFundFactory,
    Vault__factory as VaultFactory,
    ClearingHouseCallee__factory as ClearingHouseFactory,
} from "types/newContracts"
// import { Amm } from "types/contracts/Amm"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { constants } from "ethers"

export const NewContract = createContainer(useContract)

interface ERC20Map {
    usdc: string
}

interface AddressMap {
    uniswapV2Factory: string
    clearingHouseConfig: string
    marketRegistry: string
    orderBook: string
    accountBalance: string
    exchange: string
    insuranceFund: string
    vault: string
    clearingHouse: string
    erc20: ERC20Map
}

function getAddressFromChainId(chainId: number): AddressMap | undefined {
    const layer2 = metadata.staging.layers.layer2 // TODO handle stag for both prod and staging
    const networks = layer2.networks

    const network = networks.find(n => n.chainId === chainId)

    const contracts = network?.contracts
    const erc20 = network?.erc20

    if (!contracts || !erc20) {
        console.log("This nework is not supported")
        return
    }

    return {
        uniswapV2Factory: contracts.uniswapV2Factory,
        clearingHouseConfig: contracts.clearingHouseConfig,
        marketRegistry: contracts.marketRegistry,
        orderBook: contracts.orderBook,
        accountBalance: contracts.accountBalance,
        exchange: contracts.exchange,
        insuranceFund: contracts.insuranceFund,
        vault: contracts.vault,
        clearingHouse: contracts.clearingHouse,
        erc20: erc20,
    }
}

const defaultContractInstance = {
    isInitialized: false,
    erc20: null,
    uniswap: null,
    clearingHouseConfig: null,
    marketRegistry: null,
    orderBook: null,
    accountBalance: null,
    exchange: null,
    insuranceFund: null,
    vault: null,
    clearingHouse: null,
    addressMap: null,
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
            uniswapV2Factory: UniswapV2FactoryFactory.connect(contractAddress.uniswapV2Factory, baseNetworkProvider),
            clearingHouseConfig: ClearingHouseConfigFactory.connect(
                contractAddress.clearingHouseConfig,
                baseNetworkProvider,
            ),
            marketRegistry: MarketRegistryFactory.connect(contractAddress.marketRegistry, baseNetworkProvider),
            orderBook: OrderBookFactory.connect(contractAddress.orderBook, baseNetworkProvider),
            accountBalance: AccountBalanceFactory.connect(contractAddress.accountBalance, baseNetworkProvider),
            exchange: ExchangeFactory.connect(contractAddress.exchange, baseNetworkProvider),
            insuranceFund: InsuranceFundFactory.connect(contractAddress.insuranceFund, baseNetworkProvider),
            vault: VaultFactory.connect(contractAddress.vault, baseNetworkProvider),
            clearingHouse: ClearingHouseFactory.connect(contractAddress.clearingHouse, baseNetworkProvider),
            addressMap: contractAddress,
            erc20: Erc20Factory.connect(constants.AddressZero, baseNetworkProvider),
        }
    }, [chainId, baseNetworkProvider])
}
