import { BigNumber, ContractTransaction, Signer } from "ethers"

import { PerpdexExchange } from "types/newContracts"

export class ContractExecutor {
    constructor(readonly contract: PerpdexExchange, readonly signer: Signer | undefined) {
        if (signer) {
            this.contract = contract.connect(signer)
        }
    }

    deposit(amountX10_D: BigNumber): Promise<ContractTransaction> {
        return this.execute("deposit", [amountX10_D])
    }

    withdraw(token: string, amountX10_D: BigNumber): Promise<ContractTransaction> {
        return this.execute("withdraw", [token, amountX10_D])
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
