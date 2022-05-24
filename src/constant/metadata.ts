export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            clearingHouse: "0xa615f6507391A96dF3718aa780644f08cd075DC7",
                            quoteToken: "0x1e7B25e87c8B460a90e46f8E66D8d5c727B77310",
                            baseTokens: [
                                {
                                    baseTokenUsd: "0x55c64113E49c7Fbc4Ee99a7bE32F42630CB1e468",
                                },
                            ],
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
