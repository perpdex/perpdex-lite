import { useCallback, useEffect, useReducer } from "react"
import { createContainer } from "unstated-next"
import { Contract } from "container/contract"
import { BaseAssetType, BaseSymbolType, InverseMarket, QuoteSymbolType } from "constant/market"
import { Connection } from "container/connection"
import { Transaction } from "container/transaction"
import { ContractExecutor } from "./ContractExecutor"
import { PerpdexMarket } from "types/newContracts"
import Big from "big.js"

// import { useContractEvent } from "./useContractEvent"

// function sqrtPriceX96ToPrice(x: Big): Big {
//     return x.div(Big(2).pow(96)).pow(2)
// }

enum ACTIONS {
    SELECT_MARKET = "SELECT_MARKET",
    UPDATE_MARK_PRICE = "UPDATE_MARK_PRICE",
}

type ActionType =
    | {
          type: ACTIONS.SELECT_MARKET
          payload: { market?: InverseMarket; contract?: PerpdexMarket; contractExecuter?: ContractExecutor }
      }
    | { type: ACTIONS.UPDATE_MARK_PRICE; payload: { markPrice: Big } }

const initialState = {
    currentMarket: undefined as InverseMarket | undefined,
    contract: undefined as PerpdexMarket | undefined,
    contractExecuter: undefined as ContractExecutor | undefined,
    markPrice: undefined as Big | undefined,
}

function reducer(state: typeof initialState, action: ActionType) {
    switch (action.type) {
        case ACTIONS.SELECT_MARKET: {
            return {
                ...state,
                currentMarket: action.payload.market,
                contract: action.payload.contract,
                contractExecuter: action.payload.contractExecuter,
            }
        }
        case ACTIONS.UPDATE_MARK_PRICE: {
            return {
                ...state,
                markPrice: action.payload.markPrice,
            }
        }
        default:
            throw new Error()
    }
}

export const PerpdexMarketContainer = createContainer(usePerpdexMarketContainer)

function usePerpdexMarketContainer() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { signer } = Connection.useContainer()
    const { isInitialized, perpdexMarket, quoteSymbol } = Contract.useContainer()

    const { execute } = Transaction.useContainer()

    useEffect(() => {
        if (isInitialized && perpdexMarket && perpdexMarket.usd && quoteSymbol) {
            const defaultBase = perpdexMarket.usd

            const market = {
                baseAddress: defaultBase.address,
                baseAssetSymbol: defaultBase.symbol as BaseSymbolType,
                quoteAssetSymbol: quoteSymbol as QuoteSymbolType,
                baseAssetSymbolDisplay: defaultBase.symbol as string,
                quoteAssetSymbolDisplay: quoteSymbol as string,
            }
            const contract = defaultBase.contract
            const contractExecuter = new ContractExecutor(defaultBase.contract, signer)

            dispatch({ type: ACTIONS.SELECT_MARKET, payload: { market, contract, contractExecuter } })
        }
    }, [isInitialized, perpdexMarket, quoteSymbol, signer])

    const selectMarket = useCallback(
        (assetType: BaseAssetType) => {
            if (!perpdexMarket) return

            const selectedBase = perpdexMarket[assetType]

            const market = {
                baseAddress: selectedBase.address,
                baseAssetSymbol: selectedBase.symbol as BaseSymbolType,
                quoteAssetSymbol: quoteSymbol as QuoteSymbolType,
                baseAssetSymbolDisplay: selectedBase.symbol as string,
                quoteAssetSymbolDisplay: quoteSymbol as string,
            }
            const contract = selectedBase.contract
            const contractExecuter = new ContractExecutor(selectedBase.contract, signer)

            dispatch({ type: ACTIONS.SELECT_MARKET, payload: { market, contract, contractExecuter } })
        },
        [perpdexMarket, quoteSymbol, signer],
    )

    const getMarkPrice = useCallback(async () => {
        if (!state.contract) return

        // const currentMarkPrice = state.contract.baseBalancePerShareX96()
        const currentMarkPrice = new Big(2000) // FIX
        if (!currentMarkPrice) return

        return currentMarkPrice
    }, [state.contract])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && state.currentMarket) {
                const markPrice = await getMarkPrice()
                markPrice && dispatch({ type: ACTIONS.UPDATE_MARK_PRICE, payload: { markPrice } })
            }
        })()
    }, [getMarkPrice, isInitialized, state.currentMarket])

    const removeLiquidity = useCallback(() => {
        console.log("FIX")
    }, [])

    return {
        state,
        selectMarket,
        getMarkPrice,
        execute,
        removeLiquidity,
    }
}
