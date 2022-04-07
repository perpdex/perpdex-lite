import { BigNumber, ContractTransaction, Signer } from "ethers"
import { Decimal, Side } from "constant"

import { ClearingHousePerpdex } from "types/newContracts"
import { ClearingHousePerpdexActions } from "./type"

function getDeadline(): Number {
    return Math.floor(Date.now() / 1000) + 120
}

export class ContractExecutorPerpdex implements ClearingHousePerpdexActions {
    constructor(readonly contract: ClearingHousePerpdex, readonly signer: Signer | undefined) {
        if (signer) {
            this.contract = contract.connect(signer)
        }
    }

    addLiquidity(
        baseToken: string,
        base: Decimal,
        quote: Decimal,
        minBase: Decimal,
        minQuote: Decimal,
    ): Promise<ContractTransaction> {
        return this.execute("addLiquidity", [
            {
                baseToken: baseToken,
                base: base,
                quote: quote,
                minBase: minBase,
                minQuote: minQuote,
                deadline: getDeadline(),
            },
        ])
    }

    removeLiquidity(
        baseToken: string,
        liquidity: Decimal,
        minBase: Decimal,
        minQuote: Decimal,
    ): Promise<ContractTransaction> {
        return this.execute("removeLiquidity", [
            {
                baseToken: baseToken,
                liquidity: liquidity,
                minBase: minBase,
                minQuote: minQuote,
                deadline: getDeadline(),
            },
        ])
    }

    openPosition(
        baseToken: string,
        side: Side,
        baseAmount: Decimal,
        quoteAmountBound: Decimal,
    ): Promise<ContractTransaction> {
        const isLong = side == Side.Long

        return this.execute("openPosition", [
            {
                baseToken: baseToken,
                isBaseToQuote: !isLong,
                isExactInput: !isLong,
                amount: baseAmount,
                oppositeAmountBound: quoteAmountBound,
                deadline: getDeadline(),
                referralCode: 0,
            },
        ])
    }

    closePosition(baseToken: string, quoteAmountBound: Decimal): Promise<ContractTransaction> {
        return this.execute("openPosition", [
            {
                baseToken: baseToken,
                oppositeAmountBound: quoteAmountBound,
                deadline: getDeadline(),
                referralCode: 0,
            },
        ])
    }

    async execute(funcName: string, args: any[]) {
        const overrides = { from: this.contract.signer.getAddress() }

        return this.contract[funcName](...args, {
            ...overrides,
            // NOTE: hard code the gasLimit, until estimateGas function can always return a reasonable number.
            gasLimit: BigNumber.from(3_800_000),
            // NOTE: Instead of using a lower customized gas price, we use the default gas price which is provided by the metamask.
            // gasPrice: utils.parseUnits("2", "gwei"),
        })
    }
}
