export const metadata = {
    staging: {
        layers: {
            layer2: {
                networks: [
                    {
                        name: "rinkeby",
                        chainId: 4,
                        contracts: {
                            perpdexExchange: "0xf5382704abe9252Ae93a37dAeB53324d822b85dF",
                            perpdexMarket: {
                                usd: "b45cb22f6e0a309d844db62286612428749806cc",
                                btc: "0xba70da40454be6d5c82ef7c20376ba850260f287",
                                link: "0x6662ed3a119bff55a40a3cf9ecc0c5eee6b0178b",
                                matic: "0x30219c1b79d4d996f22ad4030302dd438130afef",
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
