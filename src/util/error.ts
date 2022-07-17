import { BigNumber } from "ethers"

const MAX_GAS_LIMIT = 12500000

export class TxRejectError extends Error {
    constructor() {
        super()
        this.name = "Transaction Reject Error"
        this.message = ""
    }
}

// These error classes will be used in the future when we refactor the error handling logic
export class ExceedMaximumGasLimitError extends Error {
    public gasLimit: BigNumber
    constructor(gasLimit: BigNumber) {
        super()
        this.name = `ExceedMaximumGasLimitError`
        this.message = `The estimated gas limit ${gasLimit.toString()} is too high, which is larger than ${MAX_GAS_LIMIT}. Please contact our support.`
        this.gasLimit = gasLimit
    }
}

export class EstimateGasError extends Error {
    constructor(funcName: string) {
        super()
        this.name = `EstimateGasError`
        this.message = `EstimatedGas for function "${funcName}" failed. Please contact our support.`
    }
}

export class BiconomyError extends Error {
    constructor(message: string) {
        super()
        this.name = `BiconomyError`
        this.message = `${message}`
    }
}

export class AmmError extends Error {
    constructor(
        public ammName: string,
        public funcName: string,
        public ammAddress: string,
        public message: string = "",
    ) {
        super()
        this.name = `AmmError:${ammName}:${funcName}`
    }
}

export function getReason(exception: any) {
    const message = exception?.data?.message || exception?.message || ""
    return message.replace(/.*revert /, "")
}

export function getErrorMessageFromReason(reason: string) {
    return (
        {
            "PM_S: too large amount": "Too large amount",
            "TL_VS: too large opposite amount": "Too large slippage",
            "TL_VS: too small opposite amount": "Too large slippage",
        }[reason] ||
        reason ||
        "Unknown error"
    )
}
