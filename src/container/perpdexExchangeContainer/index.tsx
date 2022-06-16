import { BIG_NUMBER_ZERO } from "../../constant"
import { big2BigNum, bigNum2FixedStr, parseEther } from "util/format"
import { useCallback, useEffect, useState } from "react"

import { Big } from "big.js"
import { Connection } from "../connection"
import { Contract } from "../contract"
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { BigNumber } from "ethers"

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

interface MakerInfo {
    liquidity: BigNumber
    cumBaseSharePerLiquidityX96: BigNumber
    cumQuotePerLiquidityX96: BigNumber
}

interface TakerInfo {
    baseBalanceShare: BigNumber
    quoteBalance: BigNumber
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
    const { isInitialized, perpdexExchange } = Contract.useContainer()
    const { currentState, currentMarket } = PerpdexMarketContainer.useContainer()
    const { execute } = Transaction.useContainer()

    /**
     * state of perpdexExchangeContiner
     */
    const [contractExecuter, setContractExecuter] = useState<ContractExecutor | undefined>(undefined)
    const [makerInfo, setMakerInfo] = useState<MakerInfo | undefined>(undefined)
    const [takerInfo, setTakerInfo] = useState<TakerInfo | undefined>(undefined)

    useEffect(() => {
        if (perpdexExchange) {
            const _contractExecuter = new ContractExecutor(perpdexExchange, signer)
            setContractExecuter(_contractExecuter)
        }
    }, [perpdexExchange, signer])

    useEffect(() => {
        if (!perpdexExchange || !account || !currentMarket) return
        ;(async () => {
            const totalAccountValue = await perpdexExchange.getTotalAccountValue(account)
            const positionNotional = await perpdexExchange.getPositionNotional(account, currentMarket)
            const makerInfo = await perpdexExchange.getMakerInfo(account, currentMarket)
            console.log("totalAccountValue", totalAccountValue)
            console.log("positionNotional", positionNotional)
            console.log("makerInfo", makerInfo)
        })()
    }, [account, perpdexExchange, currentMarket])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && account && perpdexExchange && currentMarket) {
                const _makerInfo = await perpdexExchange.getMakerInfo(account, currentMarket)
                setMakerInfo(_makerInfo)
            }
        })()
    }, [account, isInitialized, perpdexExchange, currentMarket])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && account && perpdexExchange && currentMarket) {
                const _takerInfo = await perpdexExchange.getTakerInfo(account, currentMarket)
                console.log(
                    bigNum2FixedStr(_takerInfo.baseBalanceShare, 18),
                    bigNum2FixedStr(_takerInfo.quoteBalance, 18),
                )
                setTakerInfo(_takerInfo)
            }
        })()
    }, [account, isInitialized, perpdexExchange, currentMarket])

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
            if (!currentState || !currentState.markPrice) return
            const { isExactInput, position, oppositeAmountBound } = calcTrade(
                isBaseToQuote,
                collateral,
                slippage,
                currentState.markPrice,
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
        [account, contractExecuter, execute, currentState?.markPrice, currentMarket],
    )

    const previewTrade = useCallback(
        async (isBaseToQuote: boolean, collateral: Big, slippage: number) => {
            if (perpdexExchange && account && currentState && currentState.markPrice) {
                const { isExactInput, position, oppositeAmountBound } = calcTrade(
                    isBaseToQuote,
                    collateral,
                    slippage,
                    currentState.markPrice,
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
        [account, perpdexExchange, currentState, currentMarket],
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

    return {
        state: {
            makerInfo,
            takerInfo,
        },
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
