import { Big } from "big.js"
import { BigNumber } from "ethers"

export const ERC20_DECIMAL_DIGITS = 18

export const USDC_PRECISION = 4

export const DISPLAY_DIGITS = 9

export const BIG_ZERO = new Big(0)

export interface Decimal {
    d: BigNumber
}
