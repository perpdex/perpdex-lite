import { ContractTransaction } from "ethers"
import { Dir, Side, Decimal } from "constant"
import { BigNumber } from "ethers"

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
