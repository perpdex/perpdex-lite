import { ContractTransaction } from "ethers"
import { Dir, Side, Decimal } from "constant"

type ReturnType = ContractTransaction | string

export interface ClearingHouseActions {
    addMargin(ammAddress: string, increaseMargin: Decimal): Promise<ReturnType>

    removeMargin(ammAddress: string, decreaseMargin: Decimal): Promise<ReturnType>

    openPosition(
        ammAddress: string,
        dir: Dir,
        quoteAssetAmount: Decimal,
        leverage: Decimal,
        minBaseAssetAmount: Decimal,
    ): Promise<ReturnType>

    closePosition(ammAddress: string, quoteAssetAmountLimit: Decimal): Promise<ReturnType>

    adjustPosition(ammAddress: string): Promise<ReturnType>
}

export interface ClearingHousePerpdexActions {
    addLiquidity(
        baseToken: string,
        base: Decimal,
        quote: Decimal,
        minBase: Decimal,
        minQuote: Decimal,
    ): Promise<ReturnType>

    removeLiquidity(baseToken: string, liquidity: Decimal, minBase: Decimal, minQuote: Decimal): Promise<ReturnType>

    openPosition(baseToken: string, side: Side, baseAmount: Decimal, quoteAmountBound: Decimal): Promise<ReturnType>

    closePosition(baseToken: string, quoteAmountBound: Decimal): Promise<ReturnType>
}

export interface TypedData<T> {
    types: Record<string, any[]>
    primaryType: string
    domain: Record<string, any>
    message: T
}
