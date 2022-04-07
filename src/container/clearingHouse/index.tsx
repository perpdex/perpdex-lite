import { Decimal, Dir, Network, Side } from "../../constant"
import { big2Decimal, bigNum2Decimal } from "util/format"
import { useCallback, useMemo } from "react"

import { Big } from "big.js"
import { BigNumber } from "ethers"
import { ClearingHousePerpdexActions } from "./type"
import { Connection } from "../connection"
import { NewContract } from "../newContract"
import { ContractExecutorPerpdex } from "./ContractExecutorPerpdex"
import { Transaction } from "../transaction"
import { createContainer } from "unstated-next"

export const ClearingHouse = createContainer(useClearingHouse)

export interface Executors {
    [Network.Mumbai]: ClearingHousePerpdexActions
    // [Network.Xdai]: ClearingHousePerpdexActions,
}

function useClearingHouse() {
    const { signer } = Connection.useContainer()
    const { clearingHouse } = NewContract.useContainer()
    const { execute } = Transaction.useContainer()

    const executors: Executors | null = useMemo(() => {
        if (!clearingHouse || !signer) {
            return null
        }
        return {
            [Network.Mumbai]: new ContractExecutorPerpdex(clearingHouse, signer),
        }
    }, [clearingHouse, void 0, signer])

    const currentExecutor = useMemo(() => {
        return executors ? executors[Network.Mumbai] : null
    }, [executors])

    const closePosition = useCallback(
        (baseToken: string, quoteAmountBound: Big) => {
            if (currentExecutor) {
                execute(currentExecutor.closePosition(baseToken, big2Decimal(quoteAmountBound)))
            }
        },
        [currentExecutor, execute],
    )

    const openPosition = useCallback(
        (baseToken: string, side: Side, baseAmount: Big, quoteAmountBound: Big) => {
            if (currentExecutor) {
                execute(
                    currentExecutor.openPosition(
                        baseToken,
                        side,
                        big2Decimal(baseAmount),
                        big2Decimal(quoteAmountBound),
                    ),
                )
            }
        },
        [currentExecutor, execute],
    )

    const addLiquidity = useCallback(
        (baseToken: string, base: Big, quote: Big, minBase: Big, minQuote: Big) => {
            if (currentExecutor) {
                execute(
                    currentExecutor.addLiquidity(
                        baseToken,
                        big2Decimal(base),
                        big2Decimal(quote),
                        big2Decimal(minBase),
                        big2Decimal(minQuote),
                    ),
                )
            }
        },
        [currentExecutor, execute],
    )

    const removeLiquidity = useCallback(
        (baseToken: string, liquidity: Big, minBase: Big, minQuote: Big) => {
            if (currentExecutor) {
                execute(
                    currentExecutor.removeLiquidity(
                        baseToken,
                        big2Decimal(liquidity),
                        big2Decimal(minBase),
                        big2Decimal(minQuote),
                    ),
                )
            }
        },
        [currentExecutor, execute],
    )

    return {
        openPosition,
        closePosition,
        addLiquidity,
        removeLiquidity,
    }
}
