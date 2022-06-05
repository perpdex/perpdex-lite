import { useCallback, useEffect, useMemo, useReducer } from "react"
import { createContainer } from "unstated-next"
import { BIG_NUMBER_ZERO, Network } from "../../constant"
import { Big } from "big.js"
import { big2BigNum, ethFormatUnits } from "../../util/format"
import { ContractExecutor } from "./ContractExecutor"
import { Contract } from "../contract"
import { Connection } from "../connection"
import { Transaction } from "../transaction"
import { useToken } from "../../hook/useToken"
import { useContractEvent } from "../../hook/useContractEvent"
import { BigNumber } from "ethers"

export interface Executors {
    [Network.Xdai]: ContractExecutor
}

enum ACTIONS {
    OPEN_ACCOUNT_MODAL = "OPEN_ACCOUNT_MODAL",
    CLOSE_ACCOUNT_MODAL = "CLOSE_ACCOUNT_MODAL",
    UPDATE_COLLATERAL = "UPDATE_COLLATERAL",
}

type ActionType =
    | { type: ACTIONS.OPEN_ACCOUNT_MODAL; payload: { isDeposit: boolean } }
    | { type: ACTIONS.CLOSE_ACCOUNT_MODAL }
    | { type: ACTIONS.UPDATE_COLLATERAL; payload: { collateral: BigNumber } }

const initialState = {
    modal: {
        isAccountModalOpen: false,
        isDeposit: true,
    },
    collateral: BIG_NUMBER_ZERO,
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.OPEN_ACCOUNT_MODAL: {
            return {
                ...state,
                modal: {
                    isAccountModalOpen: true,
                    isDeposit: action.payload.isDeposit,
                },
            }
        }
        case ACTIONS.CLOSE_ACCOUNT_MODAL: {
            return {
                ...state,
                modal: {
                    ...state.modal,
                    isAccountModalOpen: false,
                },
            }
        }
        case ACTIONS.UPDATE_COLLATERAL: {
            return {
                ...state,
                collateral: action.payload.collateral,
            }
        }
        default:
            throw new Error()
    }
}

export const AccountPerpdex = createContainer(useAccount)

function useAccount() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { account, signer, chainId } = Connection.useContainer()
    const { perpdexExchange, ercTokenAddress } = Contract.useContainer()
    const { execute } = Transaction.useContainer()
    const { balance, approve, allowance, queryAllowanceBySpender, decimals } = useToken(
        ercTokenAddress.settlementToken,
        chainId ? chainId : 1,
    )
    const collateralToken = ercTokenAddress.settlementToken

    const executors: Executors | null = useMemo(() => {
        if (!perpdexExchange || !signer) {
            return null
        }
        return {
            [Network.Xdai]: new ContractExecutor(perpdexExchange, signer), // TODO: fix
        }
    }, [perpdexExchange, signer])

    const currentExecutor = useMemo(() => {
        return executors ? executors[Network.Xdai] : null // TODO: fix
    }, [executors])

    const openAccountModal = useCallback(
        (isDeposit: boolean) => {
            dispatch({ type: ACTIONS.OPEN_ACCOUNT_MODAL, payload: { isDeposit } })
        },
        [dispatch],
    )

    const closeAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_ACCOUNT_MODAL })
    }, [dispatch])

    const deposit = useCallback(
        async (amount: Big) => {
            if (currentExecutor && collateralToken) {
                const spender = currentExecutor.contract.address
                await queryAllowanceBySpender(spender)
                if (!allowance[spender] || amount.gt(allowance[spender])) {
                    try {
                        await approve(spender, amount)
                    } catch (e) {
                        console.error(e)
                    }
                }

                await execute(currentExecutor.deposit(big2BigNum(amount, decimals)))
            }
        },
        [currentExecutor, queryAllowanceBySpender, allowance, execute, collateralToken, decimals, approve],
    )

    const withdraw = useCallback(
        (amount: Big) => {
            if (currentExecutor && collateralToken) {
                execute(currentExecutor.withdraw(big2BigNum(amount, decimals)))
            }
        },
        [currentExecutor, execute, collateralToken, decimals],
    )

    useContractEvent(perpdexExchange, "Deposited", (trader, amount) => {
        if (trader === account) {
            console.log("Deposited event", ethFormatUnits(amount), state.collateral.add(amount))
            dispatch({ type: ACTIONS.UPDATE_COLLATERAL, payload: { collateral: state.collateral.add(amount) } })
        }
    })

    useContractEvent(perpdexExchange, "Withdrawn", (trader, amount) => {
        if (trader === account) {
            console.log("Withdrawn event", ethFormatUnits(amount), state.collateral.add(amount))
            dispatch({ type: ACTIONS.UPDATE_COLLATERAL, payload: { collateral: state.collateral.sub(amount) } })
        }
    })

    useEffect(() => {
        async function fetchAccountValue() {
            if (account && perpdexExchange) {
                const accountValue = await perpdexExchange.callStatic.getTotalAccountValue(account)
                dispatch({ type: ACTIONS.UPDATE_COLLATERAL, payload: { collateral: accountValue } })
            }
        }
        fetchAccountValue()
    }, [decimals, account, perpdexExchange])

    return {
        state,
        actions: {
            openAccountModal,
            closeAccountModal,
        },
        deposit,
        withdraw,
        balance,
    }
}
