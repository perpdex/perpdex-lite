import { useState, useEffect, useCallback, useMemo } from "react"
import { constants } from "ethers"
import { Big } from "big.js"
import { NewContract } from "container/newContract"
import { BIG_ZERO } from "../constant/number"
import { Connection } from "../container/connection"
import { Transaction, TransactionAction } from "../container/transaction"
import { big2BigNum, bigNum2Big } from "../util/format"
import { useContractCall } from "./useContractCall"
import { isAddress } from "@ethersproject/address"
import { useContractEvent } from "./useContractEvent"

export function useTokenPerpdex(address: string, decimals: number, chainId: number) {
    const { account, signer } = Connection.useContainer()
    const {
        erc20: { usdc },
    } = NewContract.useContainer()
    const { executeWithGasLimit } = Transaction.useContainer()
    const [balance, setBalance] = useState(BIG_ZERO)
    const [allowance, setAllowance] = useState<Record<string, Big>>({})
    const [totalSupply, setTotalSupply] = useState(BIG_ZERO)

    const usdcContract = useMemo(() => {
        return isAddress(address) ? usdc?.attach(address) || null : null
    }, [address, usdc])

    useEffect(() => {
        async function fetchToken() {
            if (usdcContract) {
                const _totalSupply = await usdcContract.totalSupply()
                setTotalSupply(bigNum2Big(_totalSupply, decimals))
            }
        }
        fetchToken()
    }, [usdcContract, decimals])

    useEffect(() => {
        async function fetchBalance() {
            if (usdc && account) {
                const balanace = await usdc.balanceOf(account)
                setBalance(bigNum2Big(balanace, decimals))
            }
        }
        fetchBalance()
    }, [account, decimals, usdc])

    const queryAllowanceBySpender = useCallback(
        async (spender: string) => {
            if (spender && usdcContract && account) {
                const _allowance = await usdcContract.allowance(account, spender)
                setAllowance(prev => ({
                    ...prev,
                    [spender]: bigNum2Big(_allowance, decimals),
                }))
            }
        },
        [usdcContract, account, decimals],
    )

    const approve = useContractCall(
        async (contractAddress: string, amount: Big) => {
            const receipt = await executeWithGasLimit(
                usdcContract!.connect(signer),
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
        [executeWithGasLimit, signer, usdcContract],
    )

    const approveInfinity = useContractCall(
        async (contractAddress: string) => {
            const receipt = await executeWithGasLimit(
                usdcContract!.connect(signer),
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
        [executeWithGasLimit, signer, usdcContract],
    )

    useContractEvent(usdcContract, "Transfer", async (from: string, to: string) => {
        if (usdcContract && (from === account || to === account)) {
            const balance = await usdcContract.balanceOf(account)
            setBalance(bigNum2Big(balance, decimals))
        }
    })

    useContractEvent(usdcContract, "Approval", async (owner: string, spender: string) => {
        if (usdcContract && owner === account) {
            const allowance = await usdcContract.allowance(owner, spender)
            setAllowance(prev => ({
                ...prev,
                [spender]: bigNum2Big(allowance, decimals),
            }))
        }
    })

    return {
        usdcContract,
        decimals,
        totalSupply,
        balance,
        allowance,
        queryAllowanceBySpender,
        approve,
        approveInfinity,
    }
}
