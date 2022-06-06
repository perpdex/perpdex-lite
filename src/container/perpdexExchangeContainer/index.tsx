import { BIG_NUMBER_ZERO, Network, Side } from "../../constant"
import { big2BigNum, parseEther } from "util/format"
import { useCallback, useEffect, useReducer } from "react"

import { Big } from "big.js"
import { PerpdexExchangeActions } from "./type"
import { Connection } from "../connection"
import { Contract } from "../contract"
import { ContractExecutor } from "./ContractExecutor"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"

enum ACTIONS {
    UPDATE_EXECUTER = "UPDATE_EXECUTER",
}

type ActionType = { type: ACTIONS.UPDATE_EXECUTER; payload: { contractExecuter?: ContractExecutor } }

const initialState = {
    contractExecuter: undefined as ContractExecutor | undefined,
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.UPDATE_EXECUTER: {
            return {
                ...state,
                contractExecuter: action.payload.contractExecuter,
            }
        }
        default:
            throw new Error()
    }
}

export const PerpdexExchangeContainer = createContainer(usePerpdexExchangeContainer)

export interface Executors {
    [Network.Mumbai]: PerpdexExchangeActions
    // [Network.Xdai]: ClearingHousePerpdexActions,
}

function usePerpdexExchangeContainer() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { signer } = Connection.useContainer()
    const { perpdexExchange } = Contract.useContainer()
    const { execute } = Transaction.useContainer()

    useEffect(() => {
        if (!perpdexExchange) return

        const contractExecuter = new ContractExecutor(perpdexExchange, signer)
        dispatch({ type: ACTIONS.UPDATE_EXECUTER, payload: { contractExecuter } })
    }, [perpdexExchange, signer])

    const deposit = useCallback(
        (amount: string) => {
            if (state.contractExecuter) {
                execute(state.contractExecuter.deposit(parseEther(amount), BIG_NUMBER_ZERO))
            }
        },
        [execute, state.contractExecuter],
    )

    const withdraw = useCallback(
        (amount: string) => {
            if (state.contractExecuter) {
                execute(state.contractExecuter.withdraw(parseEther(amount)))
            }
        },
        [execute, state.contractExecuter],
    )

    const closePosition = useCallback(
        (baseToken: string, quoteAmountBound: Big) => {
            if (state.contractExecuter) {
                execute(state.contractExecuter.closePosition(baseToken, big2BigNum(quoteAmountBound)))
            }
        },
        [execute, state.contractExecuter],
    )

    const openPosition = useCallback(
        (baseToken: string, side: Side, baseAmount: Big, quoteAmountBound: Big) => {
            if (state.contractExecuter) {
                execute(
                    state.contractExecuter.openPosition(
                        baseToken,
                        side,
                        big2BigNum(baseAmount),
                        big2BigNum(quoteAmountBound),
                    ),
                )
            }
        },
        [execute, state.contractExecuter],
    )

    const addLiquidity = useCallback(
        (baseToken: string, base: Big, quote: Big, minBase: Big, minQuote: Big) => {
            if (state.contractExecuter) {
                execute(
                    state.contractExecuter.addLiquidity(
                        baseToken,
                        big2BigNum(base),
                        big2BigNum(quote),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [execute, state.contractExecuter],
    )

    const removeLiquidity = useCallback(
        (baseToken: string, liquidity: Big, minBase: Big, minQuote: Big) => {
            if (state.contractExecuter) {
                execute(
                    state.contractExecuter.removeLiquidity(
                        baseToken,
                        big2BigNum(liquidity),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
                    ),
                )
            }
        },
        [execute, state.contractExecuter],
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
