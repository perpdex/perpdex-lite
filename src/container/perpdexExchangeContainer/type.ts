import { ContractTransaction } from "ethers"
import { BigNumber } from "ethers"

type ReturnType = ContractTransaction | string

export interface PerpdexExchangeActions {
    addLiquidity(
        market: string,
        base: BigNumber,
        quote: BigNumber,
        minBase: BigNumber,
        minQuote: BigNumber,
    ): Promise<ReturnType>

    removeLiquidity(
        trader: string,
        market: string,
        liquidity: BigNumber,
        minBase: BigNumber,
        minQuote: BigNumber,
    ): Promise<ReturnType>

    trade(
        trader: string,
        market: string,
        isBaseToQuote: boolean,
        isExactInput: boolean,
        amount: BigNumber,
        oppositeAmountBound: BigNumber,
    ): Promise<ReturnType>

    closePosition(baseToken: string, quoteAmountBound: BigNumber): Promise<ReturnType>
}

export interface TypedData<T> {
    types: Record<string, any[]>
    primaryType: string
    domain: Record<string, any>
    message: T
}
