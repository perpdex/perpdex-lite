import { useCallback } from "react"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"

enum ACTIONS {
    OPEN_LIQUIDITY_PROVIDER_MODAL = "OPEN_LIQUIDITY_PROVIDER_MODAL",
    CLOSE_LIQUIDITY_PROVIDER_MODAL = "CLOSE_LIQUIDITY_PROVIDER_MODAL",
}

type ActionType = {
    type: ACTIONS
    payload?: any
}

const initialState = {
    isLiquidityProviderModalOpen: false,
}

export const LiquidityProvider = createContainer(useLiquidityProvider)

function useLiquidityProvider() {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    const openLiquidityProviderModal = useCallback(() => {
        dispatch({
            type: ACTIONS.OPEN_LIQUIDITY_PROVIDER_MODAL,
        })
    }, [dispatch])

    const closeLiquidityProviderModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_LIQUIDITY_PROVIDER_MODAL })
    }, [dispatch])

    return {
        state,
        openLiquidityProviderModal,
        closeLiquidityProviderModal,
    }
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.OPEN_LIQUIDITY_PROVIDER_MODAL: {
            return {
                ...state,
                isLiquidityProviderModalOpen: true,
            }
        }
        case ACTIONS.CLOSE_LIQUIDITY_PROVIDER_MODAL: {
            return {
                ...state,
                isLiquidityProviderModalOpen: false,
            }
        }
        default:
            throw new Error()
    }
}
