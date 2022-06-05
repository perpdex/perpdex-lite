import { ContractTransaction } from "ethers"
import { Side } from "constant"
import { BigNumber } from "ethers"

type ReturnType = ContractTransaction | string

export interface PerpdexMarketActions {
    addLiquidity(
        baseToken: string,
        base: BigNumber,
        quote: BigNumber,
        minBase: BigNumber,
        minQuote: BigNumber,
    ): Promise<ReturnType>

    removeLiquidity(
        baseToken: string,
        liquidity: BigNumber,
        minBase: BigNumber,
        minQuote: BigNumber,
    ): Promise<ReturnType>

    openPosition(baseToken: string, side: Side, baseAmount: BigNumber, quoteAmountBound: BigNumber): Promise<ReturnType>

    closePosition(baseToken: string, quoteAmountBound: BigNumber): Promise<ReturnType>
}

export interface TypedData<T> {
    types: Record<string, any[]>
    primaryType: string
    domain: Record<string, any>
    message: T
}
