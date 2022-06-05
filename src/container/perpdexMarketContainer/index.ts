import { useCallback, useEffect, useReducer } from "react"
import { createContainer } from "unstated-next"
import { Contract } from "container/contract"
import { BaseAssetType, BaseSymbolType, InverseMarket, QuoteSymbolType } from "constant/market"
import { bigNum2Big } from "util/format"
import { Connection } from "container/connection"
import { Transaction } from "container/transaction"
import { ContractExecutor } from "./ContractExecutor"
import { PerpdexMarket } from "types/newContracts"

// import { useContractEvent } from "./useContractEvent"

// function sqrtPriceX96ToPrice(x: Big): Big {
//     return x.div(Big(2).pow(96)).pow(2)
// }

enum ACTIONS {
    SELECT_MARKET = "SELECT_MARKET",
}

type ActionType = {
    type: ACTIONS.SELECT_MARKET
    payload: { market?: InverseMarket; contract?: PerpdexMarket; contractExecuter?: ContractExecutor }
}

const initialState = {
    currentMarket: undefined as InverseMarket | undefined,
    contract: undefined as PerpdexMarket | undefined,
    contractExecuter: undefined as ContractExecutor | undefined,
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
        const currentMarkPrice = await state.contract?.getMarkPriceX96()
        if (!currentMarkPrice) return

        return bigNum2Big(currentMarkPrice)
    }, [state.contract])

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
