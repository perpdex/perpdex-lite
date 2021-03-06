import { useState, useEffect, useCallback, useMemo } from "react"
import { constants } from "ethers"
import { Big } from "big.js"
import { BIG_NUMBER_ZERO } from "../constant/number"
import { Connection } from "../container/connection"
import { Transaction, TransactionAction } from "../container/connection/transaction"
import { big2BigNum, bigNum2Big } from "../util/format"
import { useContractCall } from "./useContractCall"
import { utils } from "ethers"
import { useContractEvent } from "./useContractEvent"
import { IERC20Metadata__factory } from "types/newContracts"

export function useToken(address: string, chainId: number) {
    const { account, signer, baseNetworkProvider } = Connection.useContainer()
    const { executeWithGasLimit } = Transaction.useContainer()
    const [balance, setBalance] = useState(BIG_NUMBER_ZERO)
    const [decimals, setDecimals] = useState(0)
    const [allowance, setAllowance] = useState<Record<string, Big>>({})
    const [totalSupply, setTotalSupply] = useState(BIG_NUMBER_ZERO)

    const contract = useMemo(() => {
        return baseNetworkProvider && utils.isAddress(address)
            ? IERC20Metadata__factory.connect(address, baseNetworkProvider)
            : void 0
    }, [address, baseNetworkProvider])

    useEffect(() => {
        async function fetchToken() {
            if (contract) {
                try {
                    const decimals = await contract.decimals()
                    const totalSupply = await contract.totalSupply()
                    setTotalSupply(totalSupply)
                    setDecimals(decimals)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        fetchToken()
    }, [contract])

    useEffect(() => {
        async function fetchBalance() {
            if (contract && account) {
                try {
                    const balance = await contract.balanceOf(account)
                    setBalance(balance)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        fetchBalance()
    }, [contract, account, decimals])

    const queryAllowanceBySpender = useCallback(
        async (spender: string) => {
            if (spender && contract && account) {
                const _allowance = await contract.allowance(account, spender)
                setAllowance(prev => ({
                    ...prev,
                    [spender]: bigNum2Big(_allowance, decimals),
                }))
            }
        },
        [contract, account, decimals],
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
            setBalance(balance)
        }
    })

    useContractEvent(contract, "Approval", async (owner: string, spender: string) => {
        if (contract && owner === account) {
            const allowance = await contract.allowance(owner, spender)
            setAllowance(prev => ({
                ...prev,
                [spender]: bigNum2Big(allowance, decimals),
            }))
        }
    })

    return {
        contract,
        decimals,
        totalSupply,
        balance,
        allowance,
        queryAllowanceBySpender,
        approve,
        approveInfinity,
    }
}
