export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            uniswapV2Factory: "0xce20f16e655e39266D0F08CFf6565057E86d3892",
                            clearingHouseConfig: "0x06FEcEA4e91bcDBd7c8A60B5807c007abFB0cE4c",
                            marketRegistry: "0x495aD0f509850e6eCa8f38562443193187ccBa63",
                            orderBook: "0x01dD315eefDd5631259E10f4E0B869320D9DBFCa",
                            accountBalance: "0xb55c0F34398445246Dd1052f11D89439975b4538",
                            exchange: "0xA4017B92cF5611D39062B80f9Cd1086FCAd18a8D",
                            insuranceFund: "0xBE7503f47351A3407BfaA76C974CDd28e2F57EC4",
                            vault: "0x1174562E02E5102d156961634332b0A0C4EDaeC3",
                            clearingHouse: "0x53fcd82c21283Ac5ED5a469E2960f06d1e39b1EB",
                            baseToken: "0xdf0dd408043d5a607911B5d960d787eB01366bE0",
                        },
                        erc20: {
                            usdc: "0xeb8f08a975Ab53E34D8a0330E0D34de942C95926",
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
