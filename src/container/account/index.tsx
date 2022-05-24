import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContainer } from "unstated-next"
import { Network } from "../../constant"
import { Big } from "big.js"
import { big2BigNum, bigNum2Big } from "../../util/format"
import { ContractExecutor } from "./ContractExecutor"
import { Contract } from "../contract"
import { Connection } from "../connection"
import { Transaction } from "../transaction"
import { useToken } from "../../hook/useToken"

export interface Executors {
    [Network.Xdai]: ContractExecutor
}

enum ACTIONS {
    TOGGLE_ACCOUNT_MODAL = "TOGGLE_ACCOUNT_MODAL",
}

type ActionType = { type: ACTIONS.TOGGLE_ACCOUNT_MODAL }

const initialState = {
    modal: {
        isAccountModalOpen: false,
    },
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.TOGGLE_ACCOUNT_MODAL: {
            return {
                ...state,
                modal: {
                    isAccountModalOpen: !state.modal.isAccountModalOpen,
                },
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
    const { clearingHousePerpDex, ercTokenAddress } = Contract.useContainer()
    const { execute } = Transaction.useContainer()
    const { approve, allowance, queryAllowanceBySpender, decimals } = useToken(
        ercTokenAddress.quoteToken,
        chainId ? chainId : 1,
    )

    const [balance, setBalance] = useState<Big | null>(null)
    const [accountValue, setAccountValue] = useState<Big | null>(null)

    const toggleAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_ACCOUNT_MODAL })
    }, [dispatch])

    const executors: Executors | null = useMemo(() => {
        if (!clearingHousePerpDex || !signer) {
            return null
        }
        return {
            [Network.Xdai]: new ContractExecutor(clearingHousePerpDex, signer), // TODO: fix
        }
    }, [clearingHousePerpDex, signer])

    const currentExecutor = useMemo(() => {
        return executors ? executors[Network.Xdai] : null // TODO: fix
    }, [executors])

    const collateralToken = ercTokenAddress.quoteToken

    const deposit = useCallback(
        async (amount: Big) => {
            if (currentExecutor && collateralToken) {
                const spender = currentExecutor.contract.address
                await queryAllowanceBySpender(spender) // TODO: fix
                if (!allowance[spender] || amount.gt(allowance[spender])) {
                    await approve(spender, amount)
                    return
                }

                await execute(currentExecutor.deposit(collateralToken, big2BigNum(amount, decimals)))
            }
        },
        [currentExecutor, queryAllowanceBySpender, allowance, execute, collateralToken, decimals, approve],
    )

    const withdraw = useCallback(
        (amount: Big) => {
            if (currentExecutor && collateralToken) {
                execute(currentExecutor.withdraw(collateralToken, big2BigNum(amount, decimals)))
            }
        },
        [currentExecutor, execute, collateralToken, decimals],
    )

    useEffect(() => {
        async function fetchBalance() {
            if (account && clearingHousePerpDex) {
                const balance = await clearingHousePerpDex.getBalance(account)
                setBalance(bigNum2Big(balance, decimals))
            }
        }
        fetchBalance()
    }, [account, decimals, clearingHousePerpDex])

    useEffect(() => {
        async function fetchAccountValue() {
            if (account && clearingHousePerpDex) {
                const accountValue = await clearingHousePerpDex.getAccountValue(account)
                setAccountValue(bigNum2Big(accountValue, decimals))
            }
        }
        fetchAccountValue()
    }, [decimals, account, clearingHousePerpDex])

    return {
        state,
        actions: {
            toggleAccountModal,
        },
        deposit,
        withdraw,
        balance,
        accountValue,
    }
}
