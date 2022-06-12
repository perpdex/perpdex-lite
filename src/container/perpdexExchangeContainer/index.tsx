import { BIG_NUMBER_ZERO, Network } from "../../constant"
import { big2BigNum, parseEther } from "util/format"
import { useCallback, useEffect, useState } from "react"

import { Big } from "big.js"
import { PerpdexExchangeActions } from "./type"
import { Connection } from "../connection"
import { Contract } from "../contract"
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { BigNumber } from "ethers"

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

export interface Executors {
    [Network.Mumbai]: PerpdexExchangeActions // FIX: support chains
}

function usePerpdexExchangeContainer() {
    const { account, signer } = Connection.useContainer()
    const { perpdexExchange } = Contract.useContainer()
    const perpdexMarketContainer = PerpdexMarketContainer.useContainer()
    const { execute } = Transaction.useContainer()

    /**
     * state of perpdexExchangeContiner
     */
    const [contractExecuter, setContractExecuter] = useState<ContractExecutor | undefined>(undefined)

    useEffect(() => {
        if (perpdexExchange) {
            const _contractExecuter = new ContractExecutor(perpdexExchange, signer)
            setContractExecuter(_contractExecuter)
        }
    }, [perpdexExchange, signer])

    useEffect(() => {
        if (!perpdexExchange || !account) return
        ;(async () => {
            if (!perpdexMarketContainer.state.currentMarketInfo) return
            const marketAddress = perpdexMarketContainer.state.currentMarketInfo.baseAddress

            const totalAccountValue = await perpdexExchange.getTotalAccountValue(account)

            const positionNotional = await perpdexExchange.getPositionNotional(account, marketAddress)

            const makerInfo = await perpdexExchange.getMakerInfo(account, marketAddress)
            console.log("totalAccountValue", totalAccountValue)
            console.log("positionNotional", positionNotional)
            console.log("makerInfo", makerInfo)
        })()
    }, [account, perpdexExchange, perpdexMarketContainer.state.currentMarketInfo])

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

    const openPosition = useCallback(
        (isBaseToQuote: boolean, isExactInput: boolean, amount: BigNumber, oppositeAmountBount: BigNumber) => {
            if (contractExecuter && account && perpdexMarketContainer.state.currentMarketInfo) {
                execute(
                    contractExecuter.openPosition(
                        account,
                        perpdexMarketContainer.state.currentMarketInfo.baseAddress,
                        isBaseToQuote,
                        isExactInput,
                        amount,
                        oppositeAmountBount,
                        // big2BigNum(baseAmount),
                        // big2BigNum(quoteAmountBound),
                    ),
                )
            }
        },
        [account, contractExecuter, execute, perpdexMarketContainer.state.currentMarketInfo],
    )

    const addLiquidity = useCallback(
        (base: Big, quote: Big, minBase: Big, minQuote: Big) => {
            if (contractExecuter && account && perpdexMarketContainer.state.currentMarketInfo) {
                execute(
                    contractExecuter.addLiquidity(
                        perpdexMarketContainer.state.currentMarketInfo.baseAddress,
                        big2BigNum(base),
                        big2BigNum(quote),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [account, contractExecuter, execute, perpdexMarketContainer.state.currentMarketInfo],
    )

    const removeLiquidity = useCallback(
        (liquidity: Big, minBase: Big, minQuote: Big) => {
            if (contractExecuter && account && perpdexMarketContainer.state.currentMarketInfo) {
                execute(
                    contractExecuter.removeLiquidity(
                        account,
                        perpdexMarketContainer.state.currentMarketInfo.baseAddress,
                        big2BigNum(liquidity),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [account, contractExecuter, execute, perpdexMarketContainer.state.currentMarketInfo],
    )

    return {
        deposit,
        withdraw,
        openPosition,
        closePosition,
        addLiquidity,
        removeLiquidity,
    }
}
