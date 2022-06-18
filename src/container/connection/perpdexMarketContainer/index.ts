import { useEffect, useState, useMemo } from "react"
import { createContainer } from "unstated-next"
import { Connection } from "container/connection"
import { PerpdexMarket__factory, PerpdexExchange__factory, IERC20Metadata__factory } from "types/newContracts"
import { bigNum2Big, x96ToBig } from "util/format"
import { contractConfigs } from "constant/contract"
import { networkConfigs } from "constant/network"
import _ from "lodash"
import { constants } from "ethers"
import { MarketState } from "constant/types"
import Big from "big.js"

const createMarketContract = (address: string, signer: any) => {
    return PerpdexMarket__factory.connect(address, signer)
}

const createExchangeContract = (address: string, signer: any) => {
    return PerpdexExchange__factory.connect(address, signer)
}

const createERC20Contract = (address: string, signer: any) => {
    return IERC20Metadata__factory.connect(address, signer)
}

const nullMarketState: MarketState = {
    exchangeAddress: constants.AddressZero,
    baseSymbol: "",
    quoteSymbol: "",
    poolInfo: {
        base: Big(0),
        quote: Big(0),
        totalLiquidity: Big(0),
    },
    markPrice: Big(0),
    inverse: false,
}

export const PerpdexMarketContainer = createContainer(usePerpdexMarketContainer)

function usePerpdexMarketContainer() {
    const { signer, chainId } = Connection.useContainer()

    // core
    const [marketStates, setMarketStates] = useState<{ [key: string]: MarketState }>({})

    // utils (this can be separated into other container)
    const [currentMarket, setCurrentMarket] = useState<string>("")
    const currentMarketState: MarketState = useMemo(() => {
        return marketStates[currentMarket] || nullMarketState
    }, [marketStates, currentMarket])

    useEffect(() => {
        ;(async () => {
            if (!chainId) return

            const marketAddresses = _.flatten(
                _.map(contractConfigs[chainId].exchanges, exchange => {
                    return _.map(exchange.markets, "address")
                }),
            )

            console.log("marketAddresses", marketAddresses)

            const newMarketStates: { [key: string]: MarketState } = {}

            for (let i = 0; i < marketAddresses.length; i++) {
                const address = marketAddresses[i]
                const contract = createMarketContract(address, signer)
                const exchangeAddress = await contract.exchange()
                const exchangeContract = createExchangeContract(exchangeAddress, signer)
                const poolInfo = await contract.poolInfo()
                const baseSymbol = await contract.symbol()
                const settlementToken = await exchangeContract.settlementToken()
                const quoteSymbol =
                    settlementToken === constants.AddressZero
                        ? networkConfigs[chainId].nativeTokenSymbol
                        : await createERC20Contract(settlementToken, signer).symbol()
                const inverse = baseSymbol === "USD"
                let markPrice = Big(0)
                try {
                    const currentMarkPriceX96 = await contract.getMarkPriceX96()
                    markPrice = x96ToBig(currentMarkPriceX96, inverse)
                } catch (err) {
                    console.error(err)
                }
                newMarketStates[address] = {
                    exchangeAddress,
                    baseSymbol,
                    quoteSymbol,
                    poolInfo: {
                        base: bigNum2Big(poolInfo.base),
                        quote: bigNum2Big(poolInfo.quote),
                        totalLiquidity: bigNum2Big(poolInfo.totalLiquidity),
                    },
                    markPrice: markPrice,
                    inverse: inverse,
                }
            }
            setMarketStates(newMarketStates)
            setCurrentMarket(marketAddresses[0])
        })()
    }, [chainId, signer])

    // do not expose raw interface like contract and BigNumber
    return {
        // core functions
        marketStates,
        // utils
        currentMarket,
        setCurrentMarket,
        currentMarketState,
    }
}
