export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            clearingHouse: "0x155BdFf407997A090Acd8D3d56B5ACB492f34E7a",
                            settlementToken: "0xc778417E063141139Fce010982780140Aa0cD5Ab",
                            quoteToken: "0xCDC9AefE9E78A76e666B48daED81A2022c3e2B86",
                            baseTokens: {
                                usd: "0x9c3E3ecfEdBafEA2CF85EBA0B3a6d8cA408Ab22E",
                            },
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
