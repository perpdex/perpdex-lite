import { getStage, Stage } from "constant/stage"
import { Connection } from "container/connection"
import { NewMetaData } from "container/metadata"
// import { constants } from "ethers"
import { useMemo } from "react"
// import {
//     ClearingHouseViewer__factory as ClearingHouseViewerFactory,
//     ERC20__factory as Erc20Factory,
//     Amm__factory as AmmFactory,
//     AmmReader__factory as AmmReaderFactory,
//     ClearingHouse__factory as ClearingHouseFactory,
//     InsuranceFund__factory as InsuranceFundFactory,
//     MetaTxGateway__factory as MetaTxGatewayFactory,
// } from "types/contracts"
// import { Amm } from "types/contracts/Amm"
import { createContainer } from "unstated-next"

export const NewContract = createContainer(useContract)

// TODO: Should grab contract address info from metadata config.
// production: https://metadata.perp.exchange/production.json
// staging: https://metadata.perp.exchange/staging.json
const PRODUCTION_CONTRACTS = {}
const STAGING_CONTRACTS = {}

export const CONTRACT_ADDRESS = ((stage: Stage) =>
    ({
        [Stage.Production]: PRODUCTION_CONTRACTS,
        [Stage.Staging]: STAGING_CONTRACTS,
        [Stage.Development]: STAGING_CONTRACTS,
    }[stage]))(getStage())

interface AddressMap {
    uniV2Factory: string
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

function getAddressFromConfig(config: any): AddressMap {
    const {
        layers: {
            layer2: {
                contracts: {
                    uniV2Factory,
                    clearingHouseConfig,
                    marketRegistry,
                    orderBook,
                    accountBalance,
                    exchange,
                    insuranceFund,
                    vault,
                    clearingHouse,
                },
                externalContracts: { tether, usdc },
            },
        },
    } = config
    return {
        uniV2Factory,
        clearingHouseConfig,
        marketRegistry,
        orderBook,
        accountBalance,
        exchange,
        insuranceFund,
        vault,
        clearingHouse,
        // uniV2Factory: uniV2Factory.address,
        // clearingHouseConfig: clearingHouseConfig.address,
        // marketRegistry: marketRegistry.address,
        // orderBook: orderBook.address,
        // accountBalance: accountBalance.address,
        // exchange: exchange.address,
        // insuranceFund: insuranceFund.address,
        // vault: vault.address,
        // clearingHouse: clearingHouse.address,
        tether,
        usdc,
    }
}

const defaultContractInstance = {
    isInitialized: false,
    erc20: null,
    clearingHouseViewer: null,
    clearingHouse: null,
    insuranceFund: null,
    metaTxGateway: null,
    amm: null,
    addressMap: null,
}

function useContract() {
    const { config } = NewMetaData.useContainer()
    const { baseNetworkProvider } = Connection.useContainer()

    return useMemo(() => {
        if (!config || !baseNetworkProvider) {
            return defaultContractInstance
        }

        const contractAddress = getAddressFromConfig(config)

        return contractAddress

        // TODO prepare factory class for each contract

        // const contractAddress = getAddressFromConfig(config)
        // return {
        //     isInitialized: true,
        //     erc20: Erc20Factory.connect(constants.AddressZero, baseNetworkProvider),
        //     insuranceFund: InsuranceFundFactory.connect(contractAddress.InsuranceFund, baseNetworkProvider),
        //     ammReader: AmmReaderFactory.connect(contractAddress.AmmReader, baseNetworkProvider),
        //     amm: AmmFactory.connect(constants.AddressZero, baseNetworkProvider) as Amm,
        //     addressMap: contractAddress,
        //     clearingHouseViewer: ClearingHouseViewerFactory.connect(
        //         contractAddress.ClearingHouseViewer,
        //         baseNetworkProvider,
        //     ),
        //     clearingHouse: ClearingHouseFactory.connect(contractAddress.ClearingHouse, baseNetworkProvider),
        //     metaTxGateway: MetaTxGatewayFactory.connect(contractAddress.MetaTxGateway, baseNetworkProvider),
        // }
    }, [config, baseNetworkProvider])
}
