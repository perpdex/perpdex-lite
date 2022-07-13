import { useEffect, useState, useMemo, useCallback } from "react"
import { createContainer } from "unstated-next"
import { Connection } from "container/connection"
import { big2BigNum, bigNum2Big } from "util/format"
import { contractConfigs } from "constant/contract"
import _ from "lodash"
import { LongTokenState } from "constant/types"
import Big from "big.js"
import { usePageVisibility } from "react-page-visibility"
import {
    createERC20ContractMulticall,
    createLongTokenContract,
    createLongTokenContractMulticall,
} from "../contractFactory"
import { useInterval } from "../../../hook/useInterval"
import produce from "immer"
import { PerpdexMarketContainer } from "../perpdexMarketContainer"
import { constants } from "ethers"
import { networkConfigs } from "../../../constant/network"

const nullLongTokenState: LongTokenState = {
    address: "",
    symbol: "",
    name: "",
    assetAddress: "",
    assetSymbol: "",
    assetDecimals: 0,
    assetIsWeth: false,
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

    const fetchData = useCallback(async () => {
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
                const contract = createLongTokenContractMulticall(market.longToken.address)
                const assetContract = longTokenStates[market.address]?.assetAddress
                    ? createERC20ContractMulticall(longTokenStates[market.address].assetAddress)
                    : void 0

                return [
                    contract.asset(),
                    contract.weth(),
                    contract.symbol(),
                    contract.name(),
                    contract.totalSupply(),
                    contract.totalAssets(),
                    contract.balanceOf(account),
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
                        wethAddress,
                        symbol,
                        name,
                        totalSupply,
                        totalAssets,
                        balanceOf,
                        maxDeposit,
                        maxMint,
                        maxWithdraw,
                        maxRedeem,
                    ] = multicallResult.slice(resultIdx, resultIdx + 11)
                    resultIdx += 11

                    if (!_.has(draft, marketAddress)) {
                        draft[marketAddress] = {
                            ...nullLongTokenState,
                            symbol: symbol,
                            name: name,
                            assetAddress: assetAddress,
                            assetIsWeth: wethAddress !== constants.AddressZero,
                            address: markets[i].longToken.address,
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

                        d.assetSymbol = d.assetIsWeth ? networkConfigs[chainId].nativeTokenSymbol : assetSymbol
                        d.assetDecimals = assetDecimals
                        d.totalAssets = bigNum2Big(totalAssets, assetDecimals)
                        d.myAssets = d.myShares.eq(0) ? Big(0) : d.myShares.mul(d.totalAssets).div(d.totalSupply)
                        d.maxDeposit = bigNum2Big(maxDeposit, assetDecimals)
                        d.maxWithdraw = bigNum2Big(maxWithdraw, assetDecimals)
                    }
                }
            }),
        )
    }, [account, chainId, longTokenStates, multicallNetworkProvider])

    useEffect(() => {
        fetchData()
    }, [])

    useInterval(async () => {
        if (!isVisible) return

        console.log("perpdexLongTokenContainer polling")
        await fetchData()
    }, 5000)

    const deposit = useCallback(
        async (marketAddress: string, amount: Big) => {
            if (!account) return
            const state = longTokenStates[marketAddress]
            if (!state) return

            const contract = createLongTokenContract(state.address, signer)
            contract.connect(signer)

            const amountBigNum = big2BigNum(amount, state.assetDecimals)

            if (state.assetIsWeth) {
                // FIX gas issues
                await contract.depositETH(account, {
                    value: amountBigNum,
                })
            } else {
                await contract.deposit(amountBigNum, account)
            }
        },
        [longTokenStates, account, signer],
    )

    const redeem = useCallback(
        (marketAddress: string, amount: Big) => {
            ;(async () => {
                if (!account) return
                const state = longTokenStates[marketAddress]
                if (!state) return

                const contract = createLongTokenContract(state.address, signer)
                const amountBigNum = big2BigNum(amount)

                if (state.assetIsWeth) {
                    await contract.redeemETH(amountBigNum, account, account)
                } else {
                    await contract.redeem(amountBigNum, account, account)
                }
            })()
        },
        [longTokenStates, account, signer],
    )

    // do not expose raw interface like contract and BigNumber
    return {
        // core functions
        longTokenStates,
        deposit,
        redeem,
        // utils
        currentLongTokenState,
    }
}
