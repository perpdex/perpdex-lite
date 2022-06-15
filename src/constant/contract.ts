import perpdexDeployment from "../deployments/perpdexContract.json"
import _ from "lodash"

interface Contract {
    address: string
}

interface PerpdexMarket extends Contract {}

interface PerpdexExchange extends Contract {
    perpdexMarkets: PerpdexMarket[]
}

interface ContractConfig {
    weth: Contract
    perpdexExchanges: PerpdexExchange[]
}

export const contractConfigs: { [key: string]: ContractConfig } = {
    4: {
        weth: {
            address: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
        },
        perpdexExchanges: [],
    },
    81: {
        weth: {
            address: "0x9Af480478974a2fda7d5aE667541639164D2858B",
        },
        perpdexExchanges: [],
    },
}

_.each(contractConfigs, (value: ContractConfig, key: string) => {
    const deployment: any = perpdexDeployment
    const contracts = deployment[key][0].contracts
    const perpdexMarkets: PerpdexMarket[] = []

    _.each(contracts, (config, contractName) => {
        if (contractName.startsWith("PerpdexMarket")) {
            perpdexMarkets.push({
                address: config.address,
            })
        }
    })

    value.perpdexExchanges.push({
        address: contracts.PerpdexExchange.address,
        perpdexMarkets: perpdexMarkets,
    })
})
