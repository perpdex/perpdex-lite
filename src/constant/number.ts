import { Big } from "big.js"
import { BigNumber } from "ethers"

export const ERC20_DECIMAL_DIGITS = 18

export const USDC_PRECISION = 4

export const DISPLAY_DIGITS = 9

export const INPUT_PRECISION = 6

export const BIG_ZERO = new Big(0)

export const BIG_NUMBER_ZERO = BigNumber.from("0")

export const BIG_BASE_SHARE_DUST = Big("0.0001")
