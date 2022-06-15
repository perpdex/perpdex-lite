import _ from "lodash"
import perpdexDeployment from "../deployments/perpdexContract.json"
import perpdexStablecoin from "../deployments/perpdexStablecoin.json"

interface Contract {
    address: string
}

interface PerpdexLongToken extends Contract {}

interface PerpdexMarket extends Contract {
    longToken: PerpdexLongToken
}

interface PerpdexExchange extends Contract {
    markets: PerpdexMarket[]
}

interface ContractConfig {
    weth: Contract
    exchanges: PerpdexExchange[]
}

export const contractConfigs: { [key: string]: ContractConfig } = {
    4: {
        weth: {
            address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        },
        exchanges: [],
    },
    81: {
        weth: {
            address: "0x9Af480478974a2fda7d5aE667541639164D2858B",
        },
        exchanges: [],
    },
}

_.each(contractConfigs, (value: ContractConfig, key: string) => {
    const deployment: any = perpdexDeployment
    const stablecoinDeployment: any = perpdexStablecoin
    const contracts = deployment[key][0].contracts
    const stablecoinContracts = stablecoinDeployment[key][0].contracts
    const markets: PerpdexMarket[] = []
    const longTokens: { [key: string]: PerpdexLongToken } = {}

    _.each(stablecoinContracts, (config, contractName) => {
        if (contractName.startsWith("PerpdexLongToken")) {
            longTokens[contractName] = {
                address: config.address,
            }
        }
    })

    _.each(contracts, (config, contractName) => {
        if (contractName.startsWith("PerpdexMarket")) {
            markets.push({
                address: config.address,
                longToken: longTokens[contractName.replace("PerpdexMarket", "PerpdexLongToken")],
            })
        }
    })

    value.exchanges.push({
        address: contracts.PerpdexExchange.address,
        markets: markets,
    })
})
