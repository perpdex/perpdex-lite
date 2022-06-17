import { BIG_NUMBER_ZERO } from "../../constant"
import { big2BigNum, bigNum2Big, bigNum2FixedStr, parseEther, x96ToBig } from "util/format"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Big } from "big.js"
import { Connection } from "../connection"
import { Contract } from "../contract"
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { BigNumber } from "ethers"
import _ from "lodash"
import { contractConfigs } from "../../constant/contract"
import { useWeb3React } from "@web3-react/core"
import { PerpdexExchange__factory } from "types/newContracts"
import { ExchangeState, MakerInfo, TakerInfo } from "../../constant/types"
import produce from "immer"

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

const nullExchangeState: ExchangeState = {
    myAccountInfo: {
        takerInfos: {},
        makerInfos: {},
        collateralBalance: Big(0),
        totalAccountValue: Big(0),
    },
}

const createExchangeContract = (address: string, signer: any) => {
    return PerpdexExchange__factory.connect(address, signer)
}

const createExchangeExecutor = (address: string, signer: any) => {
    return new ContractExecutor(createExchangeContract(address, signer), signer)
}

function calcPositionSize(isBaseToQuote: boolean, notional: Big, markPrice: Big) {
    const basePosition = isBaseToQuote ? notional.mul(markPrice) : notional
    const oppositPosition = isBaseToQuote ? notional : notional.mul(markPrice)
    return {
        basePosition,
        oppositPosition,
    }
}

function calcTrade(isBaseToQuote: boolean, collateral: Big, slippage: number, markPrice: Big) {
    const isExactInput = isBaseToQuote
    const positions = calcPositionSize(isBaseToQuote, collateral, markPrice)
    const _slippage = slippage / 100

    const oppositeAmountBound = isExactInput
        ? positions.oppositPosition.mul(1 - _slippage)
        : positions.oppositPosition.mul(1 + _slippage)

    return {
        isExactInput,
        position: big2BigNum(positions.basePosition),
        oppositeAmountBound: big2BigNum(oppositeAmountBound),
    }
}

function usePerpdexExchangeContainer() {
    const { account, signer } = Connection.useContainer()
    const { marketStates, currentMarketState, currentMarket } = PerpdexMarketContainer.useContainer()
    const { execute } = Transaction.useContainer()
    const { chainId } = useWeb3React()

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

    // const [contractExecuter, setContractExecuter] = useState<ContractExecutor | undefined>(undefined)
    // const [makerInfo, setMakerInfo] = useState<MakerInfo | undefined>(undefined)
    // const [takerInfo, setTakerInfo] = useState<TakerInfo | undefined>(undefined)

    useEffect(() => {
        ;(async () => {
            if (!chainId) return
            if (!account) return
            if (!currentMarket) return

            const exchangeAddresses = _.map(contractConfigs[chainId].exchanges, "address")

            const newExchangeStates: { [key: string]: ExchangeState } = {}

            for (let i = 0; i < exchangeAddresses.length; i++) {
                const address = exchangeAddresses[i]
                const contract = createExchangeContract(address, signer)

                const collateralBalance = (await contract.accountInfos(account)).collateralBalance
                const totalAccountValue = await contract.getTotalAccountValue(account)
                const makerInfo = await contract.getMakerInfo(account, currentMarket)
                const takerInfo = await contract.getTakerInfo(account, currentMarket)

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
                    },
                }
            }
            setExchangeStates(newExchangeStates)
        })()
    }, [chainId, signer, currentMarket, account])

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

    const closePosition = useCallback(
        (baseToken: string, quoteAmountBound: Big) => {
            if (contractExecuter) {
                execute(contractExecuter.closePosition(baseToken, big2BigNum(quoteAmountBound)))
            }
        },
        [contractExecuter, execute],
    )

    const trade = useCallback(
        (isBaseToQuote: boolean, collateral: Big, slippage: number) => {
            if (!currentMarketState || !currentMarketState.markPrice) return
            const { isExactInput, position, oppositeAmountBound } = calcTrade(
                isBaseToQuote,
                collateral,
                slippage,
                currentMarketState.markPrice,
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
        [account, contractExecuter, execute, currentMarketState?.markPrice, currentMarket],
    )

    const previewTrade = useCallback(
        async (isBaseToQuote: boolean, collateral: Big, slippage: number) => {
            if (perpdexExchange && account && currentMarketState && currentMarketState.markPrice) {
                const { isExactInput, position, oppositeAmountBound } = calcTrade(
                    isBaseToQuote,
                    collateral,
                    slippage,
                    currentMarketState.markPrice,
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
            const exchange = marketStates[market].exchangeAddress

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
        [account, marketStates, signer],
    )

    return {
        // core functions
        exchangeStates,
        fetchTakerInfo,
        // utils (my account of current market)
        currentMyMakerInfo,
        currentMyTakerInfo,
        deposit,
        withdraw,
        trade,
        closePosition,
        addLiquidity,
        removeLiquidity,
        preview: {
            trade: previewTrade,
        },
    }
}
