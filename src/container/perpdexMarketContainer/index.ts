import { useCallback, useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import { Contract } from "container/contract"
import { BaseAssetType, BaseSymbolType, InverseMarket, QuoteSymbolType } from "constant/market"
import { Connection } from "container/connection"
import { Transaction } from "container/transaction"
import { ContractExecutor } from "./ContractExecutor"
import { PerpdexMarket } from "types/newContracts"
import Big from "big.js"
import { x96ToBig } from "util/format"
import { BigNumber } from "ethers"

// import { useContractEvent } from "./useContractEvent"

// function sqrtPriceX96ToPrice(x: Big): Big {
//     return x.div(Big(2).pow(96)).pow(2)
// }

interface PoolInfo {
    base: BigNumber
    quote: BigNumber
    totalLiquidity: BigNumber
    cumDeleveragedBasePerLiquidityX96: BigNumber
    cumDeleveragedQuotePerLiquidityX96: BigNumber
    baseBalancePerShareX96: BigNumber
}

export const PerpdexMarketContainer = createContainer(usePerpdexMarketContainer)

function usePerpdexMarketContainer() {
    const { signer } = Connection.useContainer()
    const { isInitialized, perpdexMarket, quoteSymbol } = Contract.useContainer()
    const { execute } = Transaction.useContainer()

    /**
     * states of perpdexMarketContainer
     */
    const [currentMarketInfo, setCurrentMarketInfo] = useState<InverseMarket | undefined>(undefined)
    const [contract, setContract] = useState<PerpdexMarket | undefined>(undefined)
    const [contractExecuter, setContractExecuter] = useState<ContractExecutor | undefined>(undefined)
    const [markPrice, setMarkPrice] = useState<Big | undefined>(undefined)
    const [poolInfo, setPoolInfo] = useState<PoolInfo | undefined>(undefined)

    const selectMarket = useCallback(
        (assetType: BaseAssetType) => {
            if (!perpdexMarket) return

            const selectedBase = perpdexMarket[assetType]

            const _market = {
                baseAddress: selectedBase.address,
                baseAssetSymbol: selectedBase.symbol as BaseSymbolType,
                quoteAssetSymbol: quoteSymbol as QuoteSymbolType,
                baseAssetSymbolDisplay: selectedBase.symbol as string,
                quoteAssetSymbolDisplay: quoteSymbol as string,
                inverse: assetType === "usd" && quoteSymbol === "ETH", // FIX: clean up
            }

            const _contract = selectedBase.contract
            const _contractExecuter = new ContractExecutor(selectedBase.contract, signer)

            setCurrentMarketInfo(_market)
            setContract(_contract)
            setContractExecuter(_contractExecuter)
        },
        [perpdexMarket, quoteSymbol, signer],
    )

    // select usd as default
    useEffect(() => {
        if (isInitialized && perpdexMarket && perpdexMarket.usd && quoteSymbol) {
            const defaultBase = "usd"
            selectMarket(defaultBase)
        }
    }, [isInitialized, perpdexMarket, quoteSymbol, selectMarket, signer])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && contract && currentMarketInfo) {
                const currentMarkPriceX96 = await contract.getMarkPriceX96()
                const _markPrice = x96ToBig(currentMarkPriceX96, currentMarketInfo.inverse)
                setMarkPrice(_markPrice)
            }
        })()
    }, [contract, currentMarketInfo, isInitialized])

    useEffect(() => {
        ;(async () => {
            if (isInitialized && contract) {
                const _poolInfo = await contract.poolInfo()
                setPoolInfo(_poolInfo)
            }
        })()
    }, [contract, isInitialized])

    return {
        state: {
            currentMarketInfo,
            contract,
            markPrice,
            poolInfo,
        },
        selectMarket,
        execute,
    }
}
