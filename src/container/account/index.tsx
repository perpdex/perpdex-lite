import { useCallback, useEffect, useReducer } from "react"
import { createContainer } from "unstated-next"
import { BIG_NUMBER_ZERO } from "../../constant"
import { ethFormatUnits } from "../../util/format"
import { Contract } from "../contract"
import { Connection } from "../connection"
import { useContractEvent } from "../../hook/useContractEvent"
import { BigNumber } from "ethers"

enum ACTIONS {
    UPDATE_BALANCE = "UPDATE_BALANCE",
    OPEN_ACCOUNT_MODAL = "OPEN_ACCOUNT_MODAL",
    CLOSE_ACCOUNT_MODAL = "CLOSE_ACCOUNT_MODAL",
    UPDATE_COLLATERAL = "UPDATE_COLLATERAL",
}

type ActionType =
    | { type: ACTIONS.UPDATE_BALANCE; payload: { balance: BigNumber } }
    | { type: ACTIONS.OPEN_ACCOUNT_MODAL; payload: { isDeposit: boolean } }
    | { type: ACTIONS.CLOSE_ACCOUNT_MODAL }
    | { type: ACTIONS.UPDATE_COLLATERAL; payload: { collateral: BigNumber } }

const initialState = {
    balance: BIG_NUMBER_ZERO,
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
        case ACTIONS.UPDATE_BALANCE: {
            return {
                ...state,
                balance: action.payload.balance,
            }
        }
        default:
            throw new Error()
    }
}

export const AccountPerpdex = createContainer(useAccount)

function useAccount() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { account, baseNetworkProvider } = Connection.useContainer()
    const { perpdexExchange } = Contract.useContainer()

    const getBalance = useCallback(async () => {
        if (account && baseNetworkProvider) {
            const balance = await baseNetworkProvider.getBalance(account)
            dispatch({ type: ACTIONS.UPDATE_BALANCE, payload: { balance } })
        }
    }, [account, baseNetworkProvider])

    const openAccountModal = useCallback(
        (isDeposit: boolean) => {
            dispatch({ type: ACTIONS.OPEN_ACCOUNT_MODAL, payload: { isDeposit } })
        },
        [dispatch],
    )

    const closeAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_ACCOUNT_MODAL })
    }, [dispatch])

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
    }, [account, perpdexExchange])

    return {
        state,
        actions: {
            getBalance,
            openAccountModal,
            closeAccountModal,
        },
    }
}
