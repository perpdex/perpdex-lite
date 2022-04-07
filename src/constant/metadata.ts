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
                        },
                    },
                    {
                        name: "mumbai",
                        chainId: 80001,
                        contracts: {
                            uniswapV2Factory: "0x17E97c09D858BE1e7C57fec1ED12447D05ec94F4",
                            clearingHouseConfig: "0x06cf9eEC832f65cfbfe88AE5595beaF97bf011a7",
                            marketRegistry: "0x28AB973Ff53fcBfc39Ef7b3a62deFa31C1ae5C77",
                            orderBook: "0xb7b1cbBf913D60C6BB9E5839C68B2ff632CD9FC9",
                            accountBalance: "0xf8ccCE38c659E5564b7239B56a64c4086310B8b8",
                            exchange: "0x6eDa4124Ba0B414dD85237D468aDd6556B0a2C18",
                            insuranceFund: "0x23337067A0C3116947c036Be2ACbFceF5a5Ea88f",
                            vault: "0x2421C23ffCD2C2D831132670866A3bdc07265F16",
                            clearingHouse: "0x70B48EC7977f9Ceccb94ef8A9DCCf95D08d0A492",
                        },
                    },
                ],
            },
        },
    },
}
