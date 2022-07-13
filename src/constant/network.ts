import { IS_MAINNET } from "./stage"

const { REACT_APP_INFURA_PROJECT_ID } = process.env

interface NetworkConfig {
    name: string
    nativeTokenSymbol: string
    rpcUrl: string
    etherscanUrl: string
    thegraphEndpoint: string
}

// TODO: set thegraphEndpoint

export const networkConfigs: { [key: string]: NetworkConfig } = IS_MAINNET
    ? {
          1: {
              name: "Ethereum",
              nativeTokenSymbol: "ETH",
              rpcUrl: `wss://mainnet.infura.io/ws/v3/${REACT_APP_INFURA_PROJECT_ID}`,
              etherscanUrl: "https://etherscan.io/",
              thegraphEndpoint: "",
          },
          592: {
              name: "Astar",
              nativeTokenSymbol: "ASTR",
              rpcUrl: `wss://rpc.astar.network`,
              etherscanUrl: "https://blockscout.com/astar/",
              thegraphEndpoint: "",
          },
      }
    : {
          4: {
              name: "Rinkeby",
              nativeTokenSymbol: "ETH",
              rpcUrl: `wss://rinkeby.infura.io/ws/v3/${REACT_APP_INFURA_PROJECT_ID}`,
              etherscanUrl: "https://rinkeby.etherscan.io/",
              thegraphEndpoint: "",
          },
          81: {
              name: "Shibuya",
              nativeTokenSymbol: "SBY",
              rpcUrl: `wss://rpc.shibuya.astar.network`,
              etherscanUrl: "https://blockscout.com/shibuya/",
              thegraphEndpoint: "https://api.subquery.network/sq/perpdex/shibuya_test2",
          },
          80001: {
              name: "Mumbai",
              nativeTokenSymbol: "MATIC",
              rpcUrl: "https://rpc-mumbai.matic.today",
              etherscanUrl: "https://mumbai.polygonscan.com/",
              thegraphEndpoint: "",
          },
      }
