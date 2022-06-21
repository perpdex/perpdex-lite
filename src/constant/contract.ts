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

export const abis = {
    PerpdexExchange: perpdexDeployment["4"][0].contracts.PerpdexExchange.abi,
    PerpdexMarket: perpdexDeployment["4"][0].contracts.PerpdexMarketUSD.abi,
    IPerpdexPriceFeed: [
        {
            inputs: [],
            name: "decimals",
            outputs: [
                {
                    internalType: "uint8",
                    name: "",
                    type: "uint8",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "getPrice",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
    ],
    IERC20Metadata: [
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "spender",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                },
            ],
            name: "Approval",
            type: "event",
        },
        {
            anonymous: false,
            inputs: [
                {
                    indexed: true,
                    internalType: "address",
                    name: "from",
                    type: "address",
                },
                {
                    indexed: true,
                    internalType: "address",
                    name: "to",
                    type: "address",
                },
                {
                    indexed: false,
                    internalType: "uint256",
                    name: "value",
                    type: "uint256",
                },
            ],
            name: "Transfer",
            type: "event",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "owner",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                },
            ],
            name: "allowance",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "approve",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "account",
                    type: "address",
                },
            ],
            name: "balanceOf",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "decimals",
            outputs: [
                {
                    internalType: "uint8",
                    name: "",
                    type: "uint8",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "name",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "symbol",
            outputs: [
                {
                    internalType: "string",
                    name: "",
                    type: "string",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "totalSupply",
            outputs: [
                {
                    internalType: "uint256",
                    name: "",
                    type: "uint256",
                },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "transfer",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
        {
            inputs: [
                {
                    internalType: "address",
                    name: "sender",
                    type: "address",
                },
                {
                    internalType: "address",
                    name: "recipient",
                    type: "address",
                },
                {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                },
            ],
            name: "transferFrom",
            outputs: [
                {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                },
            ],
            stateMutability: "nonpayable",
            type: "function",
        },
    ],
}
