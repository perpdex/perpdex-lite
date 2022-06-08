import { useCallback, useEffect, useReducer } from "react"
import { createContainer } from "unstated-next"
import { Contract } from "container/contract"
import { BaseAssetType, BaseSymbolType, InverseMarket, QuoteSymbolType } from "constant/market"
import { Connection } from "container/connection"
import { Transaction } from "container/transaction"
import { ContractExecutor } from "./ContractExecutor"
import { PerpdexMarket } from "types/newContracts"
import Big from "big.js"
import { x96ToBig } from "util/format"
import { BigNumber } from "ethers"

// import { useContractEvent } from "./useContractEvent"

// function sqrtPriceX96ToPrice(x: Big): Big {
//     return x.div(Big(2).pow(96)).pow(2)
// }

interface MakerInfo {
    baseDebtShare: BigNumber
    cumDeleveragedBaseSharePerLiquidityX96: BigNumber
    cumDeleveragedQuotePerLiquidityX96: BigNumber
    liquidity: BigNumber
    quoteDebt: BigNumber
}

interface PoolInfo {
    base: BigNumber
    quote: BigNumber
    totalLiquidity: BigNumber
    cumDeleveragedBasePerLiquidityX96: BigNumber
    cumDeleveragedQuotePerLiquidityX96: BigNumber
    baseBalancePerShareX96: BigNumber
}

enum ACTIONS {
    SELECT_MARKET = "SELECT_MARKET",
    UPDATE_MARK_PRICE = "UPDATE_MARK_PRICE",
    UPDATE_MAKER_INFO = "UPDATE_MAKER_INFO",
    UPDATE_POOL_INFO = "UPDATE_POOL_INFO",
}

type ActionType =
    | {
          type: ACTIONS.SELECT_MARKET
          payload: { market?: InverseMarket; contract?: PerpdexMarket; contractExecuter?: ContractExecutor }
      }
    | { type: ACTIONS.UPDATE_MARK_PRICE; payload: { markPrice: Big } }
    | { type: ACTIONS.UPDATE_MAKER_INFO; payload: { makerInfo: MakerInfo } }
    | { type: ACTIONS.UPDATE_POOL_INFO; payload: { poolInfo: PoolInfo } }

const initialState = {
    currentMarket: undefined as InverseMarket | undefined,
    contract: undefined as PerpdexMarket | undefined,
    contractExecuter: undefined as ContractExecutor | undefined,
    markPrice: undefined as Big | undefined,
    makerInfo: undefined as MakerInfo | undefined,
    poolInfo: undefined as PoolInfo | undefined,
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
        case ACTIONS.UPDATE_MAKER_INFO: {
            return {
                ...state,
                makerInfo: action.payload.makerInfo,
            }
        }
        case ACTIONS.UPDATE_POOL_INFO: {
            return {
                ...state,
                poolInfo: action.payload.poolInfo,
            }
        }
        default:
            throw new Error()
    }
}

export const PerpdexMarketContainer = createContainer(usePerpdexMarketContainer)

function usePerpdexMarketContainer() {
    const [state, dispatch] = useReducer(reducer, initialState)
    const { account, signer } = Connection.useContainer()
    const { isInitialized, perpdexMarket, quoteSymbol, perpdexExchange } = Contract.useContainer()

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

    useEffect(() => {
        ;(async () => {
            if (isInitialized && account && perpdexExchange && state.currentMarket) {
                const makerInfo = await perpdexExchange.getMakerInfo(account, state.currentMarket.baseAddress)
                dispatch({ type: ACTIONS.UPDATE_MAKER_INFO, payload: { makerInfo } })
            }
        })()
    }, [account, isInitialized, perpdexExchange, state.currentMarket])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && state.contract) {
                const poolInfo = await state.contract.poolInfo()

                dispatch({ type: ACTIONS.UPDATE_POOL_INFO, payload: { poolInfo } })
            }
        })()
    }, [isInitialized, state.contract])

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

        const currentMarkPriceX96 = await state.contract.getMarkPriceX96()

        if (!currentMarkPriceX96) return

        const isInverse = false
        const markPrice = x96ToBig(currentMarkPriceX96, isInverse)
        console.log("markPrice", markPrice.toString())

        return markPrice

        // const currentMarkPrice = new Big(1845) // FIX
        // return currentMarkPrice
    }, [state.contract])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && state.currentMarket) {
                const markPrice = await getMarkPrice()
                markPrice && dispatch({ type: ACTIONS.UPDATE_MARK_PRICE, payload: { markPrice } })
            }
        })()
    }, [getMarkPrice, isInitialized, state.currentMarket])

    return {
        state,
        selectMarket,
        getMarkPrice,
        execute,
    }
}
