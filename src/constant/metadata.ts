export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            perpdexExchange: "0x2aaFC6979b8D18D0d936C86895e84915B50F3569",
                            perpdexMarket: {
                                usd: "0x019b61afa0fa435fd427161930d6525bafe32b48",
                                btc: "0xaf79e952c4a559fb996fbc6f1477c001b9501c09",
                                link: "0xd51a13554c501b8e657c63871040554ae94e492e",
                                matic: "0x7b24b8da2f818e23b4fb75d7ce06ab5f627aae10",
                            },
                            settlementToken: "0x0000000000000000000000000000000000000000",
                            // quoteToken: "0xCDC9AefE9E78A76e666B48daED81A2022c3e2B86",
                            // baseTokens: {
                            //     usd: "0x9c3E3ecfEdBafEA2CF85EBA0B3a6d8cA408Ab22E",
                            // },
                        },
                    },
                    // {
                    //     name: "mumbai",
                    //     chainId: 80001,
                    //     contracts: {
                    //         clearingHouse: "0xa615f6507391A96dF3718aa780644f08cd075DC7",
                    //         quoteToken: "0x1e7B25e87c8B460a90e46f8E66D8d5c727B77310",
                    //         baseTokens: [
                    //             {
                    //                 baseTokenUsd: "0x55c64113E49c7Fbc4Ee99a7bE32F42630CB1e468"
                    //             }
                    //         ],
                    //     },
                    // },
                ],
            },
        },
    },
}
