import { BIG_NUMBER_ZERO } from "../../../constant"
import { big2BigNum, bigNum2Big, bigNum2FixedStr, x96ToBig } from "util/format"
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
import { ExchangeState, MakerInfo, TakerInfo, AccountInfo, PositionState, MarketState } from "../../../constant/types"
import { useInterval } from "../../../hook/useInterval"
import { usePageVisibility } from "react-page-visibility"
import {
    createERC20ContractMulticall,
    createExchangeContract,
    createExchangeContractMulticall,
} from "../contractFactory"

interface settlementTokenMetadataUnit {
    decimals: number
    address: string
}

type settlementTokenMetadataState = settlementTokenMetadataUnit[]

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

const createExchangeExecutor = (address: string, signer: any) => {
    return new ContractExecutor(createExchangeContract(address, signer), signer)
}

function calcTrade(isLong: boolean, amount: Big, marketState: MarketState, slippage: number) {
    const _slippage = slippage / 100
    const { markPrice, baseBalancePerShare } = marketState
    const share = amount.div(baseBalancePerShare)

    let oppositeAmountBound
    if (isLong) {
        oppositeAmountBound = share.mul(markPrice).mul(1 + _slippage)
    } else {
        oppositeAmountBound = share.mul(markPrice).mul(1 - _slippage)
    }

    console.log("@@@@", isLong, amount.toString(), oppositeAmountBound.toString())

    return {
        isBaseToQuote: !isLong,
        isExactInput: !isLong,
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
    const currentExchangeState: ExchangeState | undefined = useMemo(() => {
        return exchangeStates[currentExchange]
    }, [exchangeStates, currentExchange])
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

    const currentMyTakerPositions: PositionState | undefined = useMemo(() => {
        if (currentMarketState && currentMyTakerInfo) {
            const { markPrice } = currentMarketState

            const takerOpenNotional = currentMyTakerInfo.quoteBalance
            const size = currentMyTakerInfo.baseBalanceShare.mul(currentMarketState.baseBalancePerShare)
            if (size.eq(0)) return

            const positionValue = size.mul(markPrice)
            const entryPrice = takerOpenNotional.abs().div(size.abs())
            const unrealizedPnl = markPrice.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))
            const isLong = size.gt(0)

            return {
                isLong: isLong,
                isLongDisplay: currentMarketState.inverse ? !isLong : isLong,
                positionQuantity: size,
                positionValue,
                entryPriceDisplay: currentMarketState.inverse ? Big(1).div(entryPrice) : entryPrice,
                liqPriceDisplay: Big(0),
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
                _.map(settlementTokens, settlementToken => {
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
                    contract.getTotalPositionNotional(account),
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
            const [
                imRatio,
                mmRatio,
                settlementTokenBalance,
                accountInfo,
                totalAccountValueBigNum,
                totalPositionNotionalBigNum,
            ] = multicallResult.slice(resultIdx, resultIdx + 6)
            resultIdx += 6

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

            const totalAccountValue = bigNum2Big(totalAccountValueBigNum)
            const totalPositionNotional = bigNum2Big(totalPositionNotionalBigNum)

            newExchangeStates[exchange.address] = {
                imRatio: bigNum2Big(imRatio, 6),
                mmRatio: bigNum2Big(mmRatio, 6),
                myAccountInfo: {
                    takerInfos: takerInfos,
                    makerInfos: makerInfos,
                    settlementTokenBalance: bigNum2Big(
                        settlementTokenBalance,
                        settlementTokenMetadataLocal[idx].decimals,
                    ),
                    collateralBalance: bigNum2Big(accountInfo.collateralBalance),
                    totalAccountValue: totalAccountValue,
                    leverage: totalAccountValue.eq(0) ? Big(0) : totalPositionNotional.div(totalAccountValue),
                    marginRatio: totalPositionNotional.eq(0) ? Big(0) : totalAccountValue.div(totalPositionNotional),
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
        (amount: Big) => {
            if (contractExecuter) {
                // TODO: handle non native token
                execute(contractExecuter.deposit(big2BigNum(amount), BIG_NUMBER_ZERO))
            }
        },
        [contractExecuter, execute],
    )

    const withdraw = useCallback(
        (amount: Big) => {
            if (contractExecuter) {
                // TODO: handle non native token
                execute(contractExecuter.withdraw(big2BigNum(amount)))
            }
        },
        [contractExecuter, execute],
    )

    const trade = useCallback(
        (isLong: boolean, amount: Big, slippage: number) => {
            if (!currentMarketState || !currentMarketState.markPrice) return
            const { isBaseToQuote, isExactInput, oppositeAmountBound } = calcTrade(
                isLong,
                amount,
                currentMarketState,
                slippage,
            )

            if (contractExecuter && account && currentMarket) {
                execute(
                    contractExecuter.trade(
                        account,
                        currentMarket,
                        isBaseToQuote,
                        isExactInput,
                        big2BigNum(amount),
                        oppositeAmountBound,
                    ),
                )
            }
        },
        [currentMarketState, contractExecuter, account, currentMarket, execute],
    )

    const previewTrade = useCallback(
        async (isLong: boolean, amount: Big, slippage: number) => {
            if (perpdexExchange && account && currentMarketState && currentMarketState.markPrice) {
                const { isBaseToQuote, isExactInput, oppositeAmountBound } = calcTrade(
                    isLong,
                    amount,
                    currentMarketState,
                    slippage,
                )

                console.log(amount, bigNum2FixedStr(oppositeAmountBound, 18))

                try {
                    const results = await perpdexExchange.callStatic.trade({
                        trader: account,
                        market: currentMarket,
                        isBaseToQuote,
                        isExactInput,
                        amount: big2BigNum(amount),
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
            if (contractExecuter && account && currentMarketState) {
                execute(
                    contractExecuter.addLiquidity(
                        currentMarket,
                        big2BigNum(base.div(currentMarketState.baseBalancePerShare)),
                        big2BigNum(quote),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [account, contractExecuter, execute, currentMarketState],
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
        currentExchangeState,
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
