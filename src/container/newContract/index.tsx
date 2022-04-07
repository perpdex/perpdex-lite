import { Connection } from "container/connection"
import { metadata } from "constant"
import { constants } from "ethers"
import { useMemo } from "react"
import {
    UniswapV2ERC20__factory as UniswapV2ERC20Factory,
    ERC20__factory as Erc20Factory,
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

export const NewContract = createContainer(useContract)

interface AddressMap {
    uniswapV2ERC20Factory: string
    clearingHouseConfig: string
    marketRegistry: string
    orderBook: string
    accountBalance: string
    exchange: string
    insuranceFund: string
    vault: string
    clearingHouse: string
    tether: string
    usdc: string
}

function getAddressFromChainId(chainId: number): AddressMap | undefined {
    const layer2 = metadata.staging.layers.layer2 // TODO handle stag for both prod and staging
    const networks = layer2.networks
    const externalContracts = layer2.externalContracts

    const contracts = networks.find(n => n.chainId === chainId)?.contracts

    if (!contracts) {
        console.log("This nework is not supported")
        return
    }

    return {
        uniswapV2ERC20Factory: contracts.uniswapV2ERC20Factory,
        clearingHouseConfig: contracts.clearingHouseConfig,
        marketRegistry: contracts.marketRegistry,
        orderBook: contracts.orderBook,
        accountBalance: contracts.accountBalance,
        exchange: contracts.exchange,
        insuranceFund: contracts.insuranceFund,
        vault: contracts.vault,
        clearingHouse: contracts.clearingHouse,
        tether: externalContracts.tether,
        usdc: externalContracts.usdc,
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
        if (!chainId || !baseNetworkProvider) {
            return defaultContractInstance
        }

        const contractAddress = getAddressFromChainId(chainId)

        if (!contractAddress) return

        return {
            isInitialized: true,
            erc20: Erc20Factory.connect(constants.AddressZero, baseNetworkProvider),
            uniswap: UniswapV2ERC20Factory.connect(contractAddress.uniswapV2ERC20Factory, baseNetworkProvider),
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
        }
    }, [chainId, baseNetworkProvider])
}
