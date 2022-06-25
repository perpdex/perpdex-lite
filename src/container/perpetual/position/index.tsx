import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { useCallback, useMemo } from "react"
import { createContainer } from "unstated-next"
import { useImmerReducer } from "use-immer"
import { numberWithCommasUsdc } from "util/format"

enum ACTIONS {
    OPEN_CLOSE_POSITION_MODAL = "OPEN_CLOSE_POSITION_MODAL",
    CLOSE_CLOSE_POSITION_MODAL = "CLOSE_CLOSE_POSITION_MODAL",
    OPEN_ADJUST_MARGIN_MODAL = "OPEN_ADJUST_MARGIN_MODAL",
    CLOSE_ADJUST_MARGIN_MODAL = "CLOSE_ADJUST_MARGIN_MODAL",
}

type ActionType = {
    type: ACTIONS
    payload?: any
}

const initialState = {
    address: null,
    baseAssetSymbol: null,
    quoteAssetSymbol: null,
    isClosePositionModalOpen: false,
    isAdjustMarginModalOpen: false,
}

export const Position = createContainer(usePosition)

function usePosition() {
    const [state, dispatch] = useImmerReducer(reducer, initialState)

    // /* prepare data for UI */
    // const exitPriceStr = useMemo(() => {
    //     if (
    //         currentMyTakerPositions &&
    //         currentMyTakerPositions.notional.abs().gt(0) &&
    //         currentMyTakerPositions.size.abs().gt(0)
    //     ) {
    //         const { size, notional } = currentMyTakerPositions
    //         return numberWithCommasUsdc(size.div(notional).abs())
    //     }
    //     return "-"
    // }, [currentMyTakerPositions])

    // const marginStr = useMemo(() => {
    //     return (currentMyTakerPositions?.margin && numberWithCommasUsdc(currentMyTakerPositions.margin)) || "-"
    // }, [currentMyTakerPositions?.margin])

    // const unrPnlStr = useMemo(() => {
    //     return currentMyTakerPositions?.unrealizedPnl.toFixed(2) || "-"
    // }, [currentMyTakerPositions?.unrealizedPnl])

    // const feeStr = useMemo(() => {
    //     return currentMyTakerPositions?.fee.toFixed(2) || "-"
    // }, [currentMyTakerPositions?.fee])

    // const totalStr = useMemo(() => {
    //     if (
    //         currentMyTakerPositions &&
    //         currentMyTakerPositions.margin &&
    //         currentMyTakerPositions.unrealizedPnl &&
    //         currentMyTakerPositions.fee
    //     ) {
    //         const { margin, unrealizedPnl, fee } = currentMyTakerPositions
    //         return numberWithCommasUsdc(margin.add(unrealizedPnl).sub(fee))
    //     }
    //     return "-"
    // }, [currentMyTakerPositions])

    const openClosePositionModal = useCallback(
        (address: string, baseAssetSymbol: string, quoteAssetSymbol: string) => {
            dispatch({
                type: ACTIONS.OPEN_CLOSE_POSITION_MODAL,
                payload: {
                    address,
                    baseAssetSymbol,
                    quoteAssetSymbol,
                },
            })
        },
        [dispatch],
    )

    const closeClosePositionModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_CLOSE_POSITION_MODAL })
    }, [dispatch])

    const openAdjustMarginModal = useCallback(
        (address: string, baseAssetSymbol: string, quoteAssetSymbol: string) => {
            dispatch({
                type: ACTIONS.OPEN_ADJUST_MARGIN_MODAL,
                payload: {
                    address,
                    baseAssetSymbol,
                    quoteAssetSymbol,
                },
            })
        },
        [dispatch],
    )

    const closeAdjustMarginModal = useCallback(() => {
        dispatch({ type: ACTIONS.CLOSE_ADJUST_MARGIN_MODAL })
    }, [dispatch])

    return {
        state,
        // displayInfo: {
        //     exitPriceStr,
        //     marginStr,
        //     unrPnlStr,
        //     feeStr,
        //     totalStr,
        // },
        openClosePositionModal,
        closeClosePositionModal,
        openAdjustMarginModal,
        closeAdjustMarginModal,
    }
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.OPEN_CLOSE_POSITION_MODAL: {
            return {
                ...state,
                address: action.payload.address,
                baseAssetSymbol: action.payload.baseAssetSymbol,
                quoteAssetSymbol: action.payload.quoteAssetSymbol,
                isClosePositionModalOpen: true,
            }
        }
        case ACTIONS.CLOSE_CLOSE_POSITION_MODAL: {
            return {
                ...state,
                address: null,
                baseAssetSymbol: null,
                quoteAssetSymbol: null,
                isClosePositionModalOpen: false,
            }
        }
        case ACTIONS.OPEN_ADJUST_MARGIN_MODAL: {
            return {
                ...state,
                address: action.payload.address,
                baseAssetSymbol: action.payload.baseAssetSymbol,
                quoteAssetSymbol: action.payload.quoteAssetSymbol,
                isAdjustMarginModalOpen: true,
            }
        }
        case ACTIONS.CLOSE_ADJUST_MARGIN_MODAL: {
            return {
                ...state,
                address: null,
                baseAssetSymbol: null,
                quoteAssetSymbol: null,
                isAdjustMarginModalOpen: false,
            }
        }
        default:
            throw new Error()
    }
}
