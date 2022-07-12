import { useEffect, useState, useMemo } from "react"
import { createContainer } from "unstated-next"
import { Connection } from "container/connection"
import { bigNum2Big, x96ToBig } from "util/format"
import { contractConfigs } from "constant/contract"
import { networkConfigs } from "constant/network"
import _ from "lodash"
import { constants } from "ethers"
import { MarketState } from "constant/types"
import Big from "big.js"
import { usePageVisibility } from "react-page-visibility"
import {
    createMarketContractMulticall,
    createExchangeContractMulticall,
    createERC20ContractMulticall,
    createPriceFeedContractMulticall,
} from "../contractFactory"
import { useInterval } from "../../../hook/useInterval"
import produce from "immer"

const nullMarketState: MarketState = {
    address: constants.AddressZero,
    exchangeAddress: constants.AddressZero,
    baseSymbol: "",
    quoteSymbol: "",
    baseSymbolDisplay: "",
    quoteSymbolDisplay: "",
    poolInfo: {
        base: Big(0),
        quote: Big(0),
        totalLiquidity: Big(0),
    },
    markPrice: Big(0),
    markPriceDisplay: Big(0),
    baseBalancePerShare: Big(0),
    cumBasePerLiquidity: Big(0),
    cumQuotePerLiquidity: Big(0),
    priceFeedQuote: "",
    priceFeedBase: "",
    indexPriceQuote: Big(0),
    indexPriceBase: Big(0),
    inverse: false,
    // thegraph
    volume24h: Big(0),
    fee24h: Big(0),
}

export const PerpdexMarketContainer = createContainer(usePerpdexMarketContainer)

function usePerpdexMarketContainer() {
    const { signer, chainId, multicallNetworkProvider } = Connection.useContainer()
    const isVisible = usePageVisibility()

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
            if (!multicallNetworkProvider) return

            const marketAddresses = _.flatten(
                _.map(contractConfigs[chainId].exchanges, exchange => {
                    return _.map(exchange.markets, "address")
                }),
            )

            console.log("marketAddresses", marketAddresses)

            const multicallRequest = _.flatten(
                _.map(marketAddresses, address => {
                    const contract = createMarketContractMulticall(address)
                    return [
                        contract.exchange(),
                        contract.poolInfo(),
                        contract.symbol(),
                        contract.getMarkPriceX96(),
                        contract.baseBalancePerShareX96(),
                        contract.getCumDeleveragedPerLiquidityX96(),
                        contract.priceFeedBase(),
                        contract.priceFeedQuote(),
                    ]
                }),
            )

            const multicallResult = await multicallNetworkProvider.all(multicallRequest)

            const multicallRequest2 = _.map(_.range(marketAddresses.length), idx => {
                const exchangeAddress = multicallResult[8 * idx]
                const exchangeContract = createExchangeContractMulticall(exchangeAddress)
                return exchangeContract.settlementToken()
            })
            const settlementTokens = await multicallNetworkProvider.all(multicallRequest2)

            const multicallRequest3 = _.map(settlementTokens, settlementTokenAddress => {
                if (settlementTokenAddress === constants.AddressZero) {
                    return multicallNetworkProvider.getEthBalance(constants.AddressZero) // dummy
                }
                const settlementToken = createERC20ContractMulticall(settlementTokenAddress)
                return settlementToken.symbol()
            })
            const quoteSymbols = await multicallNetworkProvider.all(multicallRequest3)

            const newMarketStates: { [key: string]: MarketState } = {}

            for (let i = 0; i < marketAddresses.length; i++) {
                const [
                    exchangeAddress,
                    poolInfo,
                    baseSymbol,
                    markPriceX96,
                    baseBalancePerShareX96,
                    cumDeleveragedPerLiquidityX96,
                    priceFeedBase,
                    priceFeedQuote,
                ] = multicallResult.slice(8 * i, 8 * (i + 1))

                const address = marketAddresses[i]
                const inverse = baseSymbol === "USD"
                const markPrice = x96ToBig(markPriceX96)
                const markPriceDisplay = x96ToBig(markPriceX96, inverse)

                const quoteSymbol =
                    settlementTokens[i] === constants.AddressZero
                        ? networkConfigs[chainId].nativeTokenSymbol
                        : quoteSymbols[i]

                newMarketStates[address] = {
                    address,
                    exchangeAddress,
                    baseSymbol,
                    quoteSymbol,
                    baseSymbolDisplay: inverse ? quoteSymbol : baseSymbol,
                    quoteSymbolDisplay: inverse ? baseSymbol : quoteSymbol,
                    poolInfo: {
                        base: bigNum2Big(poolInfo.base),
                        quote: bigNum2Big(poolInfo.quote),
                        totalLiquidity: bigNum2Big(poolInfo.totalLiquidity),
                    },
                    markPrice: markPrice,
                    markPriceDisplay: markPriceDisplay,
                    baseBalancePerShare: x96ToBig(baseBalancePerShareX96),
                    cumBasePerLiquidity: x96ToBig(cumDeleveragedPerLiquidityX96[0]),
                    cumQuotePerLiquidity: x96ToBig(cumDeleveragedPerLiquidityX96[1]),
                    priceFeedQuote: priceFeedQuote,
                    priceFeedBase: priceFeedBase,
                    indexPriceQuote: Big(0),
                    indexPriceBase: Big(0),
                    inverse: inverse,
                }
            }
            setMarketStates(newMarketStates)
            setCurrentMarket(marketAddresses[0])
        })()
    }, [chainId, signer, multicallNetworkProvider])

    useInterval(async () => {
        if (!isVisible) return
        if (!multicallNetworkProvider) return

        console.log("perpdexMarketContainer polling")

        const marketAddresses = _.keys(marketStates)

        const multicallRequest = _.flattenDeep(
            _.map(marketAddresses, address => {
                const contract = createMarketContractMulticall(address)
                const priceFeedQuote =
                    marketStates[address].priceFeedQuote === constants.AddressZero
                        ? void 0
                        : createPriceFeedContractMulticall(marketStates[address].priceFeedQuote)
                const priceFeedBase =
                    marketStates[address].priceFeedBase === constants.AddressZero
                        ? void 0
                        : createPriceFeedContractMulticall(marketStates[address].priceFeedBase)
                return [
                    contract.poolInfo(),
                    contract.getMarkPriceX96(),
                    contract.baseBalancePerShareX96(),
                    contract.getCumDeleveragedPerLiquidityX96(),
                    priceFeedQuote
                        ? priceFeedQuote.decimals()
                        : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                    priceFeedQuote
                        ? priceFeedQuote.getPrice()
                        : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                    priceFeedBase
                        ? priceFeedBase.decimals()
                        : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                    priceFeedBase
                        ? priceFeedBase.getPrice()
                        : multicallNetworkProvider.getEthBalance(constants.AddressZero), // dummy
                ]
            }),
        )
        const multicallResult = await multicallNetworkProvider.all(multicallRequest)

        setMarketStates(
            produce(draft => {
                for (let i = 0; i < marketAddresses.length; i++) {
                    const marketAddress = marketAddresses[i]
                    const [
                        poolInfo,
                        markPriceX96,
                        baseBalancePerShareX96,
                        cumDeleveragedPerLiquidityX96,
                        priceFeedQuoteDecimals,
                        priceFeedQuotePrice,
                        priceFeedBaseDecimals,
                        priceFeedBasePrice,
                    ] = multicallResult.slice(8 * i, 8 * (i + 1))

                    if (_.has(draft, marketAddress)) {
                        const inverse = draft[marketAddress].inverse

                        const indexPriceQuote =
                            draft[marketAddress].priceFeedQuote === constants.AddressZero
                                ? Big(1)
                                : bigNum2Big(priceFeedQuotePrice, priceFeedQuoteDecimals)
                        const indexPriceBase =
                            draft[marketAddress].priceFeedBase === constants.AddressZero
                                ? Big(1)
                                : bigNum2Big(priceFeedBasePrice, priceFeedBaseDecimals)

                        const markPriceBig = x96ToBig(markPriceX96, inverse)

                        const indexPriceDisplay = inverse
                            ? indexPriceQuote
                            : indexPriceQuote.eq(0)
                            ? Big(1)
                            : indexPriceBase.div(indexPriceQuote)
                        const markPriceDisplay = markPriceBig.eq(0) ? indexPriceDisplay : markPriceBig // use index price with no pool

                        draft[marketAddress].poolInfo = {
                            base: bigNum2Big(poolInfo.base),
                            quote: bigNum2Big(poolInfo.quote),
                            totalLiquidity: bigNum2Big(poolInfo.totalLiquidity),
                        }
                        draft[marketAddress].markPrice = x96ToBig(markPriceX96)
                        draft[marketAddress].markPriceDisplay = markPriceDisplay
                        draft[marketAddress].baseBalancePerShare = x96ToBig(baseBalancePerShareX96)
                        draft[marketAddress].cumBasePerLiquidity = x96ToBig(cumDeleveragedPerLiquidityX96[0])
                        draft[marketAddress].cumQuotePerLiquidity = x96ToBig(cumDeleveragedPerLiquidityX96[1])
                        draft[marketAddress].indexPriceQuote = indexPriceQuote
                        draft[marketAddress].indexPriceBase = indexPriceBase
                    }
                }
            }),
        )
    }, 5000)

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
