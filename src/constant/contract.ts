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
    multicall: Contract
    weth: Contract
    exchanges: PerpdexExchange[]
}

export const contractConfigs: { [key: string]: ContractConfig } = {
    1: {
        multicall: {
            address: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
        },
        weth: {
            address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        },
        exchanges: [],
    },
    4: {
        multicall: {
            address: "0x5ba1e12693dc8f9c48aad8770482f4739beed696",
        },
        weth: {
            address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        },
        exchanges: [],
    },
    81: {
        multicall: {
            address: "0xF339Dd2b88e66901Cfa1d1232357eB1D491DdA32",
        },
        weth: {
            address: "0x9Af480478974a2fda7d5aE667541639164D2858B",
        },
        exchanges: [],
    },
    592: {
        multicall: {
            // https://github.com/makerdao/multicall/pull/42/files
            address: "0x7D6046156df81EF335E7e765d3bc714960B73207",
        },
        weth: {
            address: "0xaeaaf0e2c81af264101b9129c00f4440ccf0f720",
        },
        exchanges: [],
    },
}

_.each(contractConfigs, (value: ContractConfig, key: string) => {
    const deployment: any = perpdexDeployment
    const stablecoinDeployment: any = perpdexStablecoin
    if (!deployment[key]) return
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
