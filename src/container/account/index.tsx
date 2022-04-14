import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContainer } from "unstated-next"
import { Network } from "../../constant"
import { Big } from "big.js"
import { big2BigNum, bigNum2Big } from "../../util/format"
import { ContractExecutor } from "./ContractExecutor"
import { NewContract } from "../newContract"
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
    const { vault, clearingHouse, addressMap } = NewContract.useContainer()
    const { execute } = Transaction.useContainer()
    const { approve, allowance, queryAllowanceBySpender, decimals } = useToken(
        addressMap ? addressMap.erc20.usdc : "",
        chainId ? chainId : 1,
    )

    const [balance, setBalance] = useState<Big | null>(null)
    const [accountValue, setAccountValue] = useState<Big | null>(null)

    const toggleAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_ACCOUNT_MODAL })
    }, [dispatch])

    const executors: Executors | null = useMemo(() => {
        if (!vault || !signer) {
            return null
        }
        return {
            [Network.Xdai]: new ContractExecutor(vault, signer), // TODO: fix
        }
    }, [vault, signer])

    const currentExecutor = useMemo(() => {
        return executors ? executors[Network.Xdai] : null // TODO: fix
    }, [executors])

    const collateralToken = useMemo(() => {
        return addressMap?.erc20.usdc
    }, [addressMap?.erc20.usdc])

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
        [allowance, approve, collateralToken, currentExecutor, execute, queryAllowanceBySpender, decimals],
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
            if (account && vault) {
                const balance = await vault.getBalance(account)
                setBalance(bigNum2Big(balance, decimals))
            }
        }
        fetchBalance()
    }, [vault, account, decimals])

    useEffect(() => {
        async function fetchAccountValue() {
            if (account && clearingHouse) {
                const accountValue = await clearingHouse.getAccountValue(account)
                setAccountValue(bigNum2Big(accountValue, decimals))
            }
        }
        fetchAccountValue()
    }, [vault, clearingHouse, decimals])

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
