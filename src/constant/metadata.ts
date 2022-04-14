export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            uniswapV2Factory: "0xd9100b780E772f261DFBEf40C6E3A1BbE25bF694",
                            clearingHouseConfig: "0x8DB6bF46d8742f6dDAD7d9a94bEBa4a0ca39b09B",
                            marketRegistry: "0x3D9cA7C2697d3C001DC9F8d57A8d7C6d0627fEfC",
                            orderBook: "0x3De38dA0deEbC2767DBeac435BcC3D1Ca63881da",
                            accountBalance: "0xc0d8E129C2E4e1671D01b181FCEb398B7d9D78Cb",
                            exchange: "0x42C4e9A85E9f253B8B7063ee4E0D248392F598ae",
                            insuranceFund: "0x097B60e43AE87dBd6AcFF70b37F040Bbb07eb793",
                            vault: "0xA9AfE72cc4EAEEf709dA2a5C2768DeF13bf12E6B",
                            clearingHouse: "0xb0Bd315C52Ebdb222AB32888eD459bd2068a5032",
                            baseToken: "0xa8A2bFEE7248E874a9934ef6B5175328daCaB739",
                        },
                        erc20: {
                            usdc: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                        },
                    },
                    {
                        name: "mumbai",
                        chainId: 80001,
                        contracts: {
                            uniswapV2Factory: "0x3659defD3a06370129A990b67e4D0D144DbC1adC",
                            clearingHouseConfig: "0xdBfDF592Ea1460DA501E0d5a8A1Eae6F37B6675E",
                            marketRegistry: "0x30d42bcDAf2c9261986246C2969A1B08A6eA4e6A",
                            orderBook: "0xb3D7cA5d27a5d55b2599710511D7F77c82B1cbFD",
                            accountBalance: "0xD7c3F4A5443b3CAf75c364B0DB51465C04AaBBd3",
                            exchange: "0x595AE8530b7b991dDB03727304904DC1217c7F94",
                            insuranceFund: "0x6be84eb2F0f8920D5236D1EE2eCECB732f69a5B7",
                            vault: "0x6AeC6D37DbB613C0Bc8AceCDF56058bAA712c73A",
                            clearingHouse: "0x03E761Ab35a513fa8fB264Dafee090eDDc220886",
                            baseToken: "0x63c0a40b455764DB53CDdE2dEcb235f4e51fcf0c", // TODO: refactor
                        },
                        erc20: {
                            usdc: "0xe11A86849d99F524cAC3E7A0Ec1241828e332C62",
                        },
                    },
                ],
            },
        },
    },
}
