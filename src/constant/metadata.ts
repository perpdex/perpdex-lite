export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            uniswapV2Factory: "0x236B07724cF72ec2972BF4bC370E622e27b1Da9a",
                            clearingHouseConfig: "0x084Ed834f7909934c013c769e83A56E7Fc41f829",
                            marketRegistry: "0xc54eFf74e0A4A2A4E8e9112E8219962Bd305bc7d",
                            orderBook: "0xfa9fA5ED0b211B2f6E1da8547066273bd1D646A8",
                            accountBalance: "0x0062d71452f4aB35F28070Bf9CB8b465dA1a74D5",
                            exchange: "0x04F53146b3cbb9fc69c2B1E256093bDC38C5b507",
                            insuranceFund: "0xA800a5B7ff21Dd4a1aaA372A5d29dE8Aa9008C8e",
                            vault: "0xcE98A264246Af64C3CeBDBcDE00a08BC5E9B9136",
                            clearingHouse: "0xB4fE015d410C00D91d11FEBFc5335cD77C2b2468",
                            baseToken: "0xB386842Eb313eafB210D1E2B045C019AF85fcbE3",
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
