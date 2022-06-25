import { BIG_NUMBER_ZERO } from "../../../constant"
import { big2BigNum, bigNum2Big, bigNum2FixedStr, parseEther, x96ToBig } from "util/format"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Big } from "big.js"
import { Connection } from ".."
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"
import { PerpdexMarketContainer } from "../perpdexMarketContainer"
import { BigNumber } from "ethers"
import _ from "lodash"
import { contractConfigs } from "../../../constant/contract"
import { ExchangeState, MakerInfo, PositionState, TakerInfo, TakerPositionsInfo } from "../../../constant/types"
import produce from "immer"
import { useInterval } from "../../../hook/useInterval"
import { usePageVisibility } from "react-page-visibility"
import { createExchangeContract, createExchangeContractMulticall } from "../contractFactory"

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

const nullExchangeState: ExchangeState = {
    myAccountInfo: {
        takerInfos: {},
        makerInfos: {},
        collateralBalance: Big(0),
        totalAccountValue: Big(0),
        totalPositionNotional: Big(0),
    },
}

const createExchangeExecutor = (address: string, signer: any) => {
    return new ContractExecutor(createExchangeContract(address, signer), signer)
}

function calcTrade(isBaseToQuote: boolean, isInverse: boolean, baseAmount: Big, quoteAmount: Big, slippage: number) {
    const isExactInput = isBaseToQuote
    const _slippage = slippage / 100

    let position
    let oppositeAmountBound
    if (isInverse) {
        position = quoteAmount
        oppositeAmountBound = isExactInput ? baseAmount.mul(1 - _slippage) : baseAmount.mul(1 + _slippage)
    } else {
        position = baseAmount
        oppositeAmountBound = isExactInput ? quoteAmount.mul(1 - _slippage) : quoteAmount.mul(1 + _slippage)
    }

    console.log("@@@@", isExactInput, position.toString(), oppositeAmountBound.toString())

    return {
        isExactInput,
        position: big2BigNum(position),
        oppositeAmountBound: big2BigNum(oppositeAmountBound),
    }
}

function usePerpdexExchangeContainer() {
    const { account, signer, chainId, multicallNetworkProvider } = Connection.useContainer()
    const { marketStates, currentMarketState, currentMarket } = PerpdexMarketContainer.useContainer()
    const { execute } = Transaction.useContainer()
    const isVisible = usePageVisibility()

    // core
    const [exchangeStates, setExchangeStates] = useState<{ [key: string]: ExchangeState }>({})

    // utils (this can be separated into other container)
    const currentExchange: string = useMemo(() => {
        return currentMarketState?.exchangeAddress
    }, [currentMarketState?.exchangeAddress])
    // const currentExchangeState: ExchangeState = useMemo(() => {
    //     return exchangeStates[currentExchange] || nullExchangeState
    // }, [exchangeStates, currentExchange])
    const contractExecuter: ContractExecutor = useMemo(() => {
        return createExchangeExecutor(currentExchange, signer)
    }, [currentExchange, signer])
    const perpdexExchange = useMemo(() => {
        return createExchangeContract(currentExchange, signer)
    }, [currentExchange, signer])
    const currentMyMakerInfo: MakerInfo | undefined = useMemo(() => {
        return exchangeStates[currentExchange]?.myAccountInfo.makerInfos[currentMarket]
    }, [exchangeStates, currentExchange, currentMarket])
    const currentMyTakerInfo: TakerInfo | undefined = useMemo(() => {
        return exchangeStates[currentExchange]?.myAccountInfo.takerInfos[currentMarket]
    }, [exchangeStates, currentExchange, currentMarket])

    // // FIX: inverse-related bugs
    // const currentMyTakerPositions: TakerPositionsInfo | undefined = useMemo(() => {
    //     if (currentMyTakerInfo?.baseBalanceShare && currentMyTakerInfo?.quoteBalance && currentMarketState?.markPrice) {
    //         const takerOpenNotional = currentMyTakerInfo.quoteBalance
    //         const size = currentMyTakerInfo.baseBalanceShare
    //         const margin = Big(0)
    //         if (size.eq(0)) return

    //         const entryPrice = takerOpenNotional.abs().div(size.abs())
    //         const unrealizedPnl = currentMarketState.markPrice.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))

    //         const exitPrice = size.div(takerOpenNotional).abs()
    //         const fee = takerOpenNotional.mul(Big("0.003"))
    //         const total = margin.add(unrealizedPnl).sub(fee)

    //         return {
    //             notional: takerOpenNotional,
    //             size,
    //             margin,
    //             unrealizedPnl,
    //             fee,
    //             exitPrice,
    //             total
    //         }
    //     }
    //     return
    // }, [currentMarketState?.markPrice, currentMyTakerInfo?.baseBalanceShare, currentMyTakerInfo?.quoteBalance])

    const currentMyTakerPositions: PositionState | undefined = useMemo(() => {
        if (currentMarketState && currentMyTakerInfo) {
            const { inverse, markPrice, quoteSymbol, baseSymbol } = currentMarketState

            const baseAssetSymbolDisplay = inverse ? quoteSymbol : baseSymbol
            const quoteAssetSymbolDisplay = inverse ? baseSymbol : quoteSymbol

            const takerOpenNotional = currentMyTakerInfo.quoteBalance
            const size = currentMyTakerInfo.baseBalanceShare
            if (size.eq(0)) return

            const positionValue = size.mul(markPrice)
            const entryPrice = takerOpenNotional.abs().div(size.abs())
            const unrealizedPnl = markPrice.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))

            return {
                baseAssetSymbolDisplay,
                quoteAssetSymbolDisplay,
                isLong: size.gt(0),
                positionQuantity: size,
                positionValue,
                entryPrice,
                markPrice,
                liqPrice: Big(0),
                unrealizedPnl,
            }
        }
        return
    }, [currentMarketState, currentMyTakerInfo])

    useEffect(() => {
        ;(async () => {
            if (!chainId) return
            if (!account) return
            if (!currentMarket) return
            if (!multicallNetworkProvider) return

            const exchangeAddresses = _.map(contractConfigs[chainId].exchanges, "address")

            const newExchangeStates: { [key: string]: ExchangeState } = {}

            for (let i = 0; i < exchangeAddresses.length; i++) {
                const address = exchangeAddresses[i]
                const contract = createExchangeContractMulticall(address)

                const [
                    collateralBalance,
                    totalAccountValue,
                    totalPositionNotional,
                    makerInfo,
                    takerInfo,
                ] = await multicallNetworkProvider.all([
                    contract.accountInfos(account),
                    contract.getTotalAccountValue(account),
                    contract.getTotalPositionNotional(account),
                    contract.getMakerInfo(account, currentMarket),
                    contract.getTakerInfo(account, currentMarket),
                ])

                newExchangeStates[address] = {
                    myAccountInfo: {
                        takerInfos: {
                            [currentMarket]: {
                                baseBalanceShare: bigNum2Big(takerInfo.baseBalanceShare),
                                quoteBalance: bigNum2Big(takerInfo.quoteBalance),
                            },
                        },
                        makerInfos: {
                            [currentMarket]: {
                                liquidity: bigNum2Big(makerInfo.liquidity),
                                cumBaseSharePerLiquidity: x96ToBig(makerInfo.cumBaseSharePerLiquidityX96),
                                cumQuotePerLiquidity: x96ToBig(makerInfo.cumQuotePerLiquidityX96),
                            },
                        },
                        collateralBalance: bigNum2Big(collateralBalance),
                        totalAccountValue: bigNum2Big(totalAccountValue),
                        totalPositionNotional: bigNum2Big(totalPositionNotional),
                    },
                }
            }
            console.log("newExchangeStates", newExchangeStates)
            setExchangeStates(newExchangeStates)
        })()
    }, [chainId, signer, currentMarket, account, multicallNetworkProvider])

    const deposit = useCallback(
        (amount: string) => {
            if (contractExecuter) {
                execute(contractExecuter.deposit(parseEther(amount), BIG_NUMBER_ZERO))
            }
        },
        [contractExecuter, execute],
    )

    const withdraw = useCallback(
        (amount: string) => {
            if (contractExecuter) {
                execute(contractExecuter.withdraw(parseEther(amount)))
            }
        },
        [contractExecuter, execute],
    )

    const trade = useCallback(
        (isBaseToQuote: boolean, baseAmount: Big, quoteAmount: Big, slippage: number) => {
            if (!currentMarketState || !currentMarketState.markPrice) return
            const { isExactInput, position, oppositeAmountBound } = calcTrade(
                isBaseToQuote,
                currentMarketState.inverse,
                baseAmount,
                quoteAmount,
                slippage,
            )

            if (contractExecuter && account && currentMarket) {
                execute(
                    contractExecuter.trade(
                        account,
                        currentMarket,
                        isBaseToQuote,
                        isExactInput,
                        position,
                        oppositeAmountBound,
                    ),
                )
            }
        },
        [currentMarketState, contractExecuter, account, currentMarket, execute],
    )

    const previewTrade = useCallback(
        async (isBaseToQuote: boolean, baseAmount: Big, quoteAmount: Big, slippage: number) => {
            if (perpdexExchange && account && currentMarketState && currentMarketState.markPrice) {
                const { isExactInput, position, oppositeAmountBound } = calcTrade(
                    isBaseToQuote,
                    currentMarketState.inverse,
                    baseAmount,
                    quoteAmount,
                    slippage,
                )

                console.log(bigNum2FixedStr(position, 18), bigNum2FixedStr(oppositeAmountBound, 18))

                try {
                    const results = await perpdexExchange.callStatic.trade({
                        trader: account,
                        market: currentMarket,
                        isBaseToQuote,
                        isExactInput,
                        amount: position,
                        oppositeAmountBound,
                        deadline: BigNumber.from(2).pow(96),
                    })
                    return results
                } catch (err) {
                    console.error("Error previewTrade", err)
                }
            }
        },
        [account, perpdexExchange, currentMarketState, currentMarket],
    )

    const maxTrade = useCallback(
        async (isBaseToQuote: boolean) => {
            if (account && currentMarket) {
                const isExactInput = isBaseToQuote

                try {
                    const results = await perpdexExchange.callStatic.maxTrade({
                        trader: account,
                        market: currentMarket,
                        caller: account,
                        isBaseToQuote,
                        isExactInput,
                    })
                    return results
                } catch (err) {
                    console.error("Error maxTrade", err)
                }
            }
        },
        [account, currentMarket, perpdexExchange.callStatic],
    )

    useEffect(() => {
        ;(async () => {
            const results = await maxTrade(false)
            results && console.log("maxTrade:", bigNum2Big(results).toString())
        })()
    }, [maxTrade])

    const addLiquidity = useCallback(
        (base: Big, quote: Big, minBase: Big, minQuote: Big) => {
            if (contractExecuter && account && currentMarket) {
                execute(
                    contractExecuter.addLiquidity(
                        currentMarket,
                        big2BigNum(base),
                        big2BigNum(quote),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [account, contractExecuter, execute, currentMarket],
    )

    const removeLiquidity = useCallback(
        (liquidity: Big, minBase: Big, minQuote: Big) => {
            if (contractExecuter && account && currentMarket) {
                execute(
                    contractExecuter.removeLiquidity(
                        account,
                        currentMarket,
                        big2BigNum(liquidity),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [account, contractExecuter, execute, currentMarket],
    )

    const fetchTakerInfo = useCallback(
        async (options: { trader?: string; market?: string } = {}) => {
            const trader = options.trader || account
            if (!trader) return
            const market = options.market || currentMarket
            const exchange = marketStates[market]?.exchangeAddress

            const contract = createExchangeContract(exchange, signer)
            const takerInfo = await contract.getTakerInfo(trader, market)

            setExchangeStates(
                produce(draft => {
                    draft[exchange].myAccountInfo.takerInfos[market] = {
                        baseBalanceShare: bigNum2Big(takerInfo.baseBalanceShare),
                        quoteBalance: bigNum2Big(takerInfo.quoteBalance),
                    }
                }),
            )
        },
        [account, currentMarket, marketStates, signer],
    )

    useInterval(async () => {
        if (!isVisible) return

        console.log("perpdexExchangeContainer polling")
        await fetchTakerInfo()
    }, 5000)

    return {
        // core functions
        exchangeStates,
        fetchTakerInfo,
        // utils (my account of current market)
        currentMyMakerInfo,
        currentMyTakerInfo,
        currentMyTakerPositions,
        deposit,
        withdraw,
        trade,
        addLiquidity,
        removeLiquidity,
        preview: {
            trade: previewTrade,
            maxTrade: maxTrade,
        },
    }
}
