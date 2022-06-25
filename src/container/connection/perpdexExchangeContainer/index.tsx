import { BIG_NUMBER_ZERO } from "../../../constant"
import { big2BigNum, bigNum2Big, bigNum2FixedStr, parseEther, x96ToBig } from "util/format"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Big } from "big.js"
import { Connection } from ".."
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"
import { PerpdexMarketContainer } from "../perpdexMarketContainer"
import { BigNumber, constants } from "ethers"
import _ from "lodash"
import { contractConfigs } from "../../../constant/contract"
import {
    ExchangeState,
    MakerInfo,
    TakerInfo,
    AccountInfo,
    PositionState,
    settlementTokenMetadataState,
} from "../../../constant/types"
import { useInterval } from "../../../hook/useInterval"
import { usePageVisibility } from "react-page-visibility"
import {
    createERC20ContractMulticall,
    createExchangeContract,
    createExchangeContractMulticall,
} from "../contractFactory"

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

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
    const { currentMarketState, currentMarket } = PerpdexMarketContainer.useContainer()
    const { execute } = Transaction.useContainer()
    const isVisible = usePageVisibility()

    // core
    const [exchangeStates, setExchangeStates] = useState<{ [key: string]: ExchangeState }>({})
    const [settlementTokenMetadata, setSettlementTokenMetadata] = useState<settlementTokenMetadataState>([])

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
    const currentMyAccountInfo: AccountInfo | undefined = useMemo(() => {
        return exchangeStates[currentExchange]?.myAccountInfo
    }, [exchangeStates, currentExchange])
    const currentMyMakerInfo: MakerInfo | undefined = useMemo(() => {
        return exchangeStates[currentExchange]?.myAccountInfo.makerInfos[currentMarket]
    }, [exchangeStates, currentExchange, currentMarket])
    const currentMyTakerInfo: TakerInfo | undefined = useMemo(() => {
        return exchangeStates[currentExchange]?.myAccountInfo.takerInfos[currentMarket]
    }, [exchangeStates, currentExchange, currentMarket])

    // FIX: inverse-related bugs
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

    const fetchAll = useCallback(async () => {
        if (!chainId) return
        if (!account) return
        if (!multicallNetworkProvider) return

        const exchanges = contractConfigs[chainId].exchanges

        let settlementTokenMetadataLocal: settlementTokenMetadataState = settlementTokenMetadata
        if (_.isEmpty(settlementTokenMetadataLocal)) {
            const multicallRequest2 = _.map(exchanges, exchange => {
                const contract = createExchangeContractMulticall(exchange.address)
                return contract.settlementToken()
            })
            const settlementTokens = await multicallNetworkProvider.all(multicallRequest2)

            const multicallRequest3 = _.flattenDeep(
                _.map(settlementTokens, (settlementToken, idx) => {
                    return [
                        settlementToken === constants.AddressZero
                            ? multicallNetworkProvider.getEthBalance(constants.AddressZero) // dummy
                            : createERC20ContractMulticall(settlementToken).decimals(),
                    ]
                }),
            )
            const decimals = await multicallNetworkProvider.all(multicallRequest3)

            settlementTokenMetadataLocal = _.map(settlementTokens, (settlementToken, idx) => {
                return {
                    decimals: settlementToken === constants.AddressZero ? 18 : decimals[idx].toNumber(),
                    address: settlementToken,
                }
            })
            setSettlementTokenMetadata(settlementTokenMetadataLocal)
        }

        const multicallRequest = _.flattenDeep(
            _.map(exchanges, (exchange, idx) => {
                const contract = createExchangeContractMulticall(exchange.address)
                return [
                    contract.imRatio(),
                    contract.mmRatio(),
                    settlementTokenMetadataLocal[idx].address === constants.AddressZero
                        ? multicallNetworkProvider.getEthBalance(account)
                        : createERC20ContractMulticall(settlementTokenMetadataLocal[idx].address).balanceOf(account),
                    contract.accountInfos(account),
                    contract.getTotalAccountValue(account),
                    _.map(exchange.markets, market => {
                        return [
                            contract.getTakerInfo(account, market.address),
                            contract.getMakerInfo(account, market.address),
                        ]
                    }),
                ]
            }),
        )
        const multicallResult = await multicallNetworkProvider.all(multicallRequest)

        const newExchangeStates: { [key: string]: ExchangeState } = {}

        let resultIdx = 0
        _.each(exchanges, (exchange, idx) => {
            const [imRatio, mmRatio, settlementTokenBalance, accountInfo, totalAccountValue] = multicallResult.slice(
                resultIdx,
                resultIdx + 5,
            )
            resultIdx += 5

            const takerInfos: { [key: string]: any } = {}
            const makerInfos: { [key: string]: any } = {}

            _.each(exchange.markets, market => {
                const [takerInfo, makerInfo] = multicallResult.slice(resultIdx, resultIdx + 2)
                resultIdx += 2

                takerInfos[market.address] = {
                    baseBalanceShare: bigNum2Big(takerInfo.baseBalanceShare),
                    quoteBalance: bigNum2Big(takerInfo.quoteBalance),
                }
                makerInfos[market.address] = {
                    liquidity: bigNum2Big(makerInfo.liquidity),
                    cumBaseSharePerLiquidity: x96ToBig(makerInfo.cumBaseSharePerLiquidityX96),
                    cumQuotePerLiquidity: x96ToBig(makerInfo.cumQuotePerLiquidityX96),
                }
            })

            newExchangeStates[exchange.address] = {
                imRatio: bigNum2Big(imRatio, 6),
                mmRatio: bigNum2Big(mmRatio, 6),
                myAccountInfo: {
                    takerInfos: takerInfos,
                    makerInfos: makerInfos,
                    settlementTokenBalance: bigNum2Big(settlementTokenBalance, settlementTokenMetadata[idx].decimals),
                    collateralBalance: bigNum2Big(accountInfo.collateralBalance),
                    totalAccountValue: bigNum2Big(totalAccountValue),
                },
            }
        })
        return newExchangeStates
    }, [account, chainId, multicallNetworkProvider, settlementTokenMetadata])

    useEffect(() => {
        ;(async () => {
            const newExchangeStates = await fetchAll()
            if (!newExchangeStates) return

            console.log("newExchangeStates", newExchangeStates)
            setExchangeStates(newExchangeStates)
        })()
    }, [chainId, multicallNetworkProvider, account, fetchAll])

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

    useInterval(async () => {
        if (!isVisible) return

        console.log("perpdexExchangeContainer polling")
        const newExchangeStates = await fetchAll()
        if (!newExchangeStates) return

        console.log("newExchangeStates", newExchangeStates)
        setExchangeStates(newExchangeStates)
    }, 5000)

    return {
        // core functions
        exchangeStates,
        // utils (my account of current market)
        currentMyAccountInfo,
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
