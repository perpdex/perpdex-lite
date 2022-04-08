import { useCallback, useReducer } from "react"
import { createContainer } from "unstated-next"

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

    const toggleAccountModal = useCallback(() => {
        dispatch({ type: ACTIONS.TOGGLE_ACCOUNT_MODAL })
    }, [dispatch])

    return {
        state,
        actions: {
            toggleAccountModal,
        },
    }
}
