import { useEffect, useCallback, useMemo } from "react"
import { constants } from "ethers"
import { Big } from "big.js"
import { NewContract } from "container/newContract"
import { BIG_ZERO } from "../../constant/number"
import { Connection } from "../connection"
import { Transaction, TransactionAction } from "../transaction"
import { big2BigNum, bigNum2Big } from "../../util/format"
import { useContractCall } from "../../hook/useContractCall"
import { isAddress } from "@ethersproject/address"
import { useContractEvent } from "../../hook/useContractEvent"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"

enum ACTIONS {
    UPDATE_BALANCE = "UPDATE_BALANCE",
    UPDATE_DECIMALS = "UPDATE_DECIMALS",
    UPDATE_ALLOWANCE = "UPDATE_ALLOWANCE",
    UPDATE_TOTALSUPPLY = "UPDATE_TOTALSUPPLY",
}

type ActionType =
    | { type: ACTIONS.UPDATE_BALANCE; payload: { balance: Big } }
    | { type: ACTIONS.UPDATE_DECIMALS; payload: { decimals: number } }
    | { type: ACTIONS.UPDATE_ALLOWANCE; payload: { spender: string; amount: Big } }
    | { type: ACTIONS.UPDATE_TOTALSUPPLY; payload: { totalSupply: Big } }

export interface TokenState {
    balance: Big
    decimals: number
    allowance: TokenAllowanceState
    totalSupply: Big
}

type TokenAllowanceState = { [Key: string]: Big }

const initialState: TokenState = {
    balance: BIG_ZERO,
    decimals: 0,
    allowance: {},
    totalSupply: BIG_ZERO,
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.UPDATE_BALANCE: {
            return {
                ...state,
                balance: action.payload.balance,
            }
        }
        case ACTIONS.UPDATE_DECIMALS: {
            return {
                ...state,
                decimals: action.payload.decimals,
            }
        }
        case ACTIONS.UPDATE_ALLOWANCE: {
            console.log("@@@@@@@@ actions", action.payload)
            return {
                ...state,
                allowance: {
                    ...state.allowance,
                    [action.payload.spender]: action.payload.amount,
                },
            }
        }
        case ACTIONS.UPDATE_TOTALSUPPLY: {
            return {
                ...state,
                totalSupply: action.payload.totalSupply,
            }
        }
        default:
            throw new Error()
    }
}

export const TokenPerpdex = createContainer(useToken)

function useToken() {
    const [state, dispatch] = useImmerReducer(reducer, initialState)
    const { account, signer } = Connection.useContainer()
    const { addressMap, erc20 } = NewContract.useContainer()
    const { executeWithGasLimit } = Transaction.useContainer()

    const contract = useMemo(() => {
        const tokenAddress = addressMap ? addressMap.erc20.usdc : ""
        return isAddress(tokenAddress) ? erc20?.attach(tokenAddress) || null : null
    }, [addressMap, erc20])

    useEffect(() => {
        async function fetchToken() {
            if (contract) {
                try {
                    const decimals = await contract.decimals()
                    const totalSupply = await contract.totalSupply()
                    dispatch({
                        type: ACTIONS.UPDATE_TOTALSUPPLY,
                        payload: {
                            totalSupply: bigNum2Big(totalSupply, decimals),
                        },
                    })
                    dispatch({
                        type: ACTIONS.UPDATE_DECIMALS,
                        payload: {
                            decimals,
                        },
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }
        fetchToken()
    }, [contract, dispatch])

    useEffect(() => {
        async function fetchBalance() {
            if (contract && account && state.decimals) {
                try {
                    const balance = await contract.balanceOf(account)

                    dispatch({
                        type: ACTIONS.UPDATE_BALANCE,
                        payload: {
                            balance: bigNum2Big(balance, state.decimals),
                        },
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        }
        fetchBalance()
    }, [account, contract, dispatch, state.decimals])

    const queryAllowanceBySpender = useCallback(
        async (spender: string) => {
            if (spender && contract && account) {
                const allowance = await contract.allowance(account, spender)
                const amount = bigNum2Big(allowance, state.decimals)

                dispatch({
                    type: ACTIONS.UPDATE_ALLOWANCE,
                    payload: {
                        spender,
                        amount,
                    },
                })

                return amount
            }

            // failure case of fetching allowance
            return BIG_ZERO
        },
        [account, contract, dispatch, state.decimals],
    )

    const approve = useContractCall(
        async (contractAddress: string, amount: Big) => {
            const receipt = await executeWithGasLimit(
                contract!.connect(signer),
                "approve",
                [contractAddress, big2BigNum(amount)],
                {
                    action: TransactionAction.APPROVE,
                    successMsg: {
                        description: "",
                    },
                },
            )
            return receipt
        },
        [executeWithGasLimit, signer, contract],
    )

    const approveInfinity = useContractCall(
        async (contractAddress: string) => {
            const receipt = await executeWithGasLimit(
                contract!.connect(signer),
                "approve",
                [contractAddress, constants.MaxUint256],
                {
                    action: TransactionAction.APPROVE,
                    successMsg: {
                        description: "",
                    },
                },
            )
            return receipt
        },
        [executeWithGasLimit, signer, contract],
    )

    useContractEvent(contract, "Transfer", async (from: string, to: string) => {
        if (contract && (from === account || to === account)) {
            const balance = await contract.balanceOf(account)
            dispatch({
                type: ACTIONS.UPDATE_BALANCE,
                payload: {
                    balance: bigNum2Big(balance, state.decimals),
                },
            })
        }
    })

    useContractEvent(contract, "Approval", async (owner: string, spender: string) => {
        if (contract && owner === account) {
            const allowance = await contract.allowance(owner, spender)

            dispatch({
                type: ACTIONS.UPDATE_ALLOWANCE,
                payload: {
                    spender,
                    amount: bigNum2Big(allowance, state.decimals),
                },
            })
        }
    })

    return {
        state,
        contract,
        queryAllowanceBySpender,
        approve,
        approveInfinity,
    }
}
