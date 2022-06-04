import { isAddress } from "@ethersproject/address"
import Big from "big.js"
import { BIG_ZERO } from "constant"
import { Connection } from "container/connection"
// import { OldContract } from "container/oldContract"
import { useCallback, useEffect, useState } from "react"

// address is base token address
export function useOpenedPositionSize(address: string) {
    // const { addressMap, amm } = OldContract.useContainer()
    const { account, multicallNetworkProvider } = Connection.useContainer()

    const [size, setSize] = useState<Big | null>(null)
    const [margin, setMargin] = useState<Big | null>(null)
    const [unrealizedPnl, setUnrealizedPnl] = useState<Big | null>(null)
    const [outputPrice, setOutputPrice] = useState<Big | null>(null)

    const updatePositionSize = useCallback(async () => {
        if (
            multicallNetworkProvider !== null &&
            // amm !== null &&
            // addressMap !== null &&
            // isAddress(addressMap.ClearingHouseViewer) &&
            account !== null &&
            isAddress(address)
        ) {
            /* get { size, margin, unrealizedPnl } from clearingHouseViewerContract */
            // const clearingHouseViewerContract = new MulticallContract(
            //     addressMap.ClearingHouseViewer,
            //     ClearingHouseViewerArtifact.abi,
            // )
            // const data = await multicallNetworkProvider.all([
            //     clearingHouseViewerContract.getPersonalPositionWithFundingPayment(address, account),
            //     clearingHouseViewerContract.getUnrealizedPnl(address, account, PnlCalcOption.SpotPrice),
            // ])

            // const { size, margin } = data[0]
            // const unrealizedPnl = data[1]

            const b_size = Big(1)

            let _outputPrice = null
            if (b_size.eq(0)) {
                _outputPrice = BIG_ZERO
            } else {
                // const dir = b_size.gt(0) ? Dir.AddToAmm : Dir.RemoveFromAmm
                _outputPrice = Big(1)
                // _outputPrice = decimal2Big(await amm.attach(address).getOutputPrice(dir, big2Decimal(b_size.abs())))
            }

            setSize(b_size)
            setMargin(Big(2))
            setUnrealizedPnl(Big(3))
            setOutputPrice(_outputPrice)
        }
    }, [multicallNetworkProvider, account, address])

    useEffect(() => {
        updatePositionSize()
    }, [updatePositionSize])

    return {
        size,
        margin,
        unrealizedPnl,
        outputPrice,
    }
}
