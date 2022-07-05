import { useCallback, useReducer } from "react"
import { createContainer } from "unstated-next"

enum ACTIONS {
    OPEN_ACCOUNT_MODAL = "OPEN_ACCOUNT_MODAL",
    CLOSE_ACCOUNT_MODAL = "CLOSE_ACCOUNT_MODAL",
}

type ActionType =
    | { type: ACTIONS.OPEN_ACCOUNT_MODAL; payload: { isDeposit: boolean } }
    | { type: ACTIONS.CLOSE_ACCOUNT_MODAL }

const initialState = {
    modal: {
        isAccountModalOpen: false,
        isDeposit: true,
    },
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
        default:
            throw new Error()
    }
}

export const AccountPerpdex = createContainer(useAccount)

function useAccount() {
    const [state, dispatch] = useReducer(reducer, initialState)

    const openAccountModal = useCallback(
        (isDeposit: boolean) => {
            dispatch({ type: ACTIONS.OPEN_ACCOUNT_MODAL, payload: { isDeposit } })
        },
        [dispatch],
    )

    const closeAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_ACCOUNT_MODAL })
    }, [dispatch])

    return {
        state,
        actions: {
            openAccountModal,
            closeAccountModal,
        },
    }
}
