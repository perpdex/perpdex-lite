import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContainer } from "unstated-next"
import { Network } from "../../constant"
import { Big } from "big.js"
import { big2BigNum } from "../../util/format"
import { ContractExecutor } from "./ContractExecutor"
import { Contract } from "../contract"
import { Connection } from "../connection"
import { Transaction } from "../transaction"
import { useToken } from "../../hook/useToken"
import { getBlance } from "util/ethers"
import { BigNumber } from "ethers"

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
    const { account, signer, chainId, baseNetworkProvider } = Connection.useContainer()
    const { perpdexExchange, ercTokenAddress } = Contract.useContainer()
    const { execute } = Transaction.useContainer()
    const { approve, allowance, queryAllowanceBySpender, decimals } = useToken(
        ercTokenAddress.settlementToken,
        chainId ? chainId : 1,
    )

    const [balance, setBalance] = useState<BigNumber | null>(null)
    const [accountValue, setAccountValue] = useState<BigNumber | null>(null)

    const toggleAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_ACCOUNT_MODAL })
    }, [dispatch])

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

    const collateralToken = ercTokenAddress.settlementToken

    const deposit = useCallback(
        async (amount: Big) => {
            if (currentExecutor && collateralToken) {
                const spender = currentExecutor.contract.address
                await queryAllowanceBySpender(spender)
                if (!allowance[spender] || amount.gt(allowance[spender])) {
                    await approve(spender, amount)
                }

                await execute(currentExecutor.deposit(big2BigNum(amount, decimals)))
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
            if (account && perpdexExchange && baseNetworkProvider) {
                const balance = await getBlance(baseNetworkProvider, account)
                setBalance(balance)
            }
        }
        fetchBalance()
    }, [account, baseNetworkProvider, decimals, perpdexExchange])

    useEffect(() => {
        async function fetchAccountValue() {
            if (account && perpdexExchange) {
                const accountValue = await perpdexExchange.callStatic.getTotalAccountValue(account)
                setAccountValue(accountValue)
            }
        }
        fetchAccountValue()
    }, [decimals, account, perpdexExchange])

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
