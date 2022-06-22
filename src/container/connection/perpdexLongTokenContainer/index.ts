import { useEffect, useState, useMemo } from "react"
import { createContainer } from "unstated-next"
import { Connection } from "container/connection"
import { bigNum2Big } from "util/format"
import { contractConfigs } from "constant/contract"
import _ from "lodash"
import { LongTokenState } from "constant/types"
import Big from "big.js"
import { usePageVisibility } from "react-page-visibility"
import { createERC20ContractMulticall, createERC4626ContractMulticall } from "../contractFactory"
import { useInterval } from "../../../hook/useInterval"
import produce from "immer"
import { PerpdexMarketContainer } from "../perpdexMarketContainer"

const nullLongTokenState: LongTokenState = {
    symbol: "",
    assetAddress: "",
    assetSymbol: "",
    assetDecimals: 0,
    totalSupply: Big(0),
    totalAssets: Big(0),
    myShares: Big(0),
    myAssets: Big(0),
    maxDeposit: Big(0),
    maxMint: Big(0),
    maxWithdraw: Big(0),
    maxRedeem: Big(0),
}

export const PerpdexLongTokenContainer = createContainer(usePerpdexLongTokenContainer)

function usePerpdexLongTokenContainer() {
    const { signer, chainId, multicallNetworkProvider, account } = Connection.useContainer()
    const { currentMarket } = PerpdexMarketContainer.useContainer()
    const isVisible = usePageVisibility()

    // core
    const [longTokenStates, setLongTokenStates] = useState<{ [key: string]: LongTokenState }>({})

    // utils (this can be separated into other container)
    const currentLongTokenState: LongTokenState = useMemo(() => {
        return longTokenStates[currentMarket] || nullLongTokenState
    }, [longTokenStates, currentMarket])

    const fetchData = async () => {
        if (!chainId) return
        if (!account) return
        if (!multicallNetworkProvider) return

        const markets = _.flatten(_.map(contractConfigs[chainId].exchanges, "markets"))
        console.log("markets", markets)

        const assetRetrieved = _.map(markets, market => {
            return !!longTokenStates[market.address]?.assetAddress
        })

        const multicallRequest = _.flattenDeep(
            _.map(markets, market => {
                const contract = createERC4626ContractMulticall(market.longToken.address)
                const contractErc20 = createERC20ContractMulticall(market.longToken.address)
                const assetContract = longTokenStates[market.address]?.assetAddress
                    ? createERC20ContractMulticall(longTokenStates[market.address].assetAddress)
                    : void 0

                return [
                    contract.asset(),
                    contractErc20.symbol(),
                    contractErc20.totalSupply(),
                    contract.totalAssets(),
                    contractErc20.balanceOf(account),
                    contract.maxDeposit(account),
                    contract.maxMint(account),
                    contract.maxWithdraw(account),
                    contract.maxRedeem(account),
                    assetContract ? [assetContract.symbol(), assetContract.decimals()] : [],
                ]
            }),
        )
        const multicallResult = await multicallNetworkProvider.all(multicallRequest)

        setLongTokenStates(
            produce(draft => {
                let resultIdx = 0
                for (let i = 0; i < markets.length; i++) {
                    const marketAddress = markets[i].address
                    const [
                        assetAddress,
                        symbol,
                        totalSupply,
                        totalAssets,
                        balanceOf,
                        maxDeposit,
                        maxMint,
                        maxWithdraw,
                        maxRedeem,
                    ] = multicallResult.slice(resultIdx, resultIdx + 9)
                    resultIdx += 9

                    if (!_.has(draft, marketAddress)) {
                        draft[marketAddress] = {
                            ...nullLongTokenState,
                            symbol: symbol,
                            assetAddress: assetAddress,
                        }
                    }

                    const d = draft[marketAddress]
                    d.totalSupply = bigNum2Big(totalSupply)
                    d.myShares = bigNum2Big(balanceOf)
                    d.maxMint = bigNum2Big(maxMint)
                    d.maxRedeem = bigNum2Big(maxRedeem)

                    if (assetRetrieved[i]) {
                        const [assetSymbol, assetDecimals] = multicallResult.slice(resultIdx, resultIdx + 2)
                        resultIdx += 2

                        d.assetSymbol = assetSymbol
                        d.assetDecimals = assetDecimals
                        d.totalAssets = bigNum2Big(totalAssets, assetDecimals)
                        d.myAssets = d.myShares.eq(0) ? Big(0) : d.myShares.mul(d.totalAssets).div(d.totalSupply)
                        d.maxDeposit = bigNum2Big(maxDeposit, assetDecimals)
                        d.maxWithdraw = bigNum2Big(maxWithdraw, assetDecimals)
                    }
                }
            }),
        )
    }

    useEffect(() => {
        fetchData()
    }, [chainId, signer, account, multicallNetworkProvider])

    useInterval(async () => {
        if (!isVisible) return

        console.log("perpdexLongTokenContainer polling")
        fetchData()
    }, 5000)

    // do not expose raw interface like contract and BigNumber
    return {
        // core functions
        longTokenStates,
        // utils
        currentLongTokenState,
    }
}
