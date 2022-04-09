import { useCallback, useMemo, useReducer } from "react"
import { createContainer } from "unstated-next"
import { Dir, Network } from "../../constant"
import { Big } from "big.js"
import { big2Decimal } from "../../util/format"
import { ContractExecutor } from "./ContractExecutor"
import { NewContract } from "../newContract"
import { Connection } from "../connection"
import { Transaction } from "../transaction"

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
    const { signer } = Connection.useContainer()
    const { vault, addressMap } = NewContract.useContainer()
    const { execute } = Transaction.useContainer()

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
        (amount: Big) => {
            if (currentExecutor && collateralToken) {
                execute(currentExecutor.deposit(collateralToken, big2Decimal(amount)))
            }
        },
        [currentExecutor, execute, collateralToken],
    )

    const withdraw = useCallback(
        (amount: Big) => {
            if (currentExecutor && collateralToken) {
                execute(currentExecutor.withdraw(collateralToken, big2Decimal(amount)))
            }
        },
        [currentExecutor, execute, collateralToken],
    )

    return {
        state,
        actions: {
            toggleAccountModal,
        },
        deposit,
        withdraw,
    }
}
