import { useCallback, useEffect, useMemo, useReducer, useState } from "react"
import { createContainer } from "unstated-next"
import { Big } from "big.js"
import { big2BigNum, bigNum2Big } from "../../util/format"
import { ContractExecutor } from "./ContractExecutor"
import { NewContract } from "../newContract"
import { Connection } from "../connection"
import { Transaction } from "../transaction"
import { TokenPerpdex } from "../token"

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
    const { account, signer } = Connection.useContainer()
    const { vault, clearingHouse, addressMap } = NewContract.useContainer()
    const { execute } = Transaction.useContainer()
    const { state: tokenState, approve, queryAllowanceBySpender } = TokenPerpdex.useContainer()

    const [balance, setBalance] = useState<Big | null>(null)
    const [accountValue, setAccountValue] = useState<Big | null>(null)

    const toggleAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_ACCOUNT_MODAL })
    }, [dispatch])

    const currentExecutor = useMemo(() => {
        if (vault) return new ContractExecutor(vault, signer)
        return null
    }, [signer, vault])

    const collateralToken = useMemo(() => {
        return addressMap?.erc20.usdc
    }, [addressMap?.erc20.usdc])

    const getIsNeedApprove = useCallback(
        async (amount: Big) => {
            if (currentExecutor && collateralToken) {
                const spender = currentExecutor.contract.address
                const allowance = await queryAllowanceBySpender(spender)

                console.log("verifyAllowance", amount.toNumber(), allowance.toNumber())
                if (!allowance || amount.gt(allowance)) return true
            }
            return false
        },
        [collateralToken, currentExecutor, queryAllowanceBySpender],
    )

    const deposit = useCallback(
        async (amount: Big, isNeedApprove: boolean, tokenDecimals: number) => {
            if (currentExecutor && collateralToken) {
                const spender = currentExecutor.contract.address
                if (spender && isNeedApprove) {
                    await approve(spender, amount)
                }

                console.log("@@@@@@ start deposit with", collateralToken, big2BigNum(amount, tokenDecimals))
                await execute(currentExecutor.deposit(collateralToken, big2BigNum(amount, tokenDecimals)))
            }
        },
        [approve, collateralToken, currentExecutor, execute],
    )

    const withdraw = useCallback(
        async (amount: Big) => {
            if (currentExecutor && collateralToken) {
                await execute(currentExecutor.withdraw(collateralToken, big2BigNum(amount, tokenState.decimals)))
            }
        },
        [collateralToken, currentExecutor, execute, tokenState.decimals],
    )

    useEffect(() => {
        async function fetchBalance() {
            if (account && vault) {
                const balance = await vault.getBalance(account)
                setBalance(bigNum2Big(balance, tokenState.decimals))
            }
        }
        fetchBalance()
    }, [account, tokenState.decimals, vault])

    useEffect(() => {
        async function fetchAccountValue() {
            if (account && clearingHouse) {
                const accountValue = await clearingHouse.getAccountValue(account)
                setAccountValue(bigNum2Big(accountValue, tokenState.decimals))
            }
        }
        fetchAccountValue()
    }, [account, clearingHouse, tokenState.decimals])

    return {
        state,
        actions: {
            toggleAccountModal,
        },
        getIsNeedApprove,
        deposit,
        withdraw,
        balance,
        accountValue,
    }
}
