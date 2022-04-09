export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            uniswapV2Factory: "0x134148f060b77CFCBe1d56DF3f2d25795F7C1B2F",
                            clearingHouseConfig: "0x0d7c2c0c563d3d38F6BE467829431ea1EA0E8509",
                            marketRegistry: "0x4D1AE9c1A640416921DF7d8C2E81cb4ecAAdeA79",
                            orderBook: "0x1Ca8Aa3A8E12602f2b4c7AbD9ea6D0596ff51a2d",
                            accountBalance: "0x57F644ad108AA83f9959CA3612B07301D5Ce5DC0",
                            exchange: "0xfFf1a310100d3082b9E3704f003AB2f53735ca25",
                            insuranceFund: "0x209Ad0924DB73c31B74eF9Eb966eb9633472befE",
                            vault: "0xA61B4A13C62A52915f601A2679529A7D73D5A8A9",
                            clearingHouse: "0x41D608C9bE7c751217BDc671BC7327D7DB366896",
                            baseToken: "",
                        },
                        erc20: {
                            usdc: "",
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
