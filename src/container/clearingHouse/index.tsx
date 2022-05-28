import { Network, Side } from "../../constant"
import { big2BigNum } from "util/format"
import { useCallback, useMemo } from "react"

import { Big } from "big.js"
import { ClearingHousePerpdexActions } from "./type"
import { Connection } from "../connection"
import { Contract } from "../contract"
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
    const { perpdexExchange } = Contract.useContainer()
    const { execute } = Transaction.useContainer()

    const executors: Executors | null = useMemo(() => {
        if (!perpdexExchange || !signer) {
            return null
        }
        return {
            [Network.Mumbai]: new ContractExecutorPerpdex(perpdexExchange, signer),
        }
    }, [perpdexExchange, signer])

    const currentExecutor = useMemo(() => {
        return executors ? executors[Network.Mumbai] : null
    }, [executors])

    const closePosition = useCallback(
        (baseToken: string, quoteAmountBound: Big) => {
            if (currentExecutor) {
                execute(currentExecutor.closePosition(baseToken, big2BigNum(quoteAmountBound)))
            }
        },
        [currentExecutor, execute],
    )

    const openPosition = useCallback(
        (baseToken: string, side: Side, baseAmount: Big, quoteAmountBound: Big) => {
            if (currentExecutor) {
                execute(
                    currentExecutor.openPosition(baseToken, side, big2BigNum(baseAmount), big2BigNum(quoteAmountBound)),
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
                        big2BigNum(base),
                        big2BigNum(quote),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
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
                        big2BigNum(liquidity),
                        big2BigNum(minBase),
                        big2BigNum(minQuote),
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
