import { Table, Tbody, Td, Tr } from "@chakra-ui/react"
import Big from "big.js"
// import { Side } from "constant"
// import { Trade } from "container/trade"
// import { big2BigNum, numberWithCommasUsdc } from "util/format"
// import { useMemo } from "react"
// import { useOpenedPositionSize } from "../useOpenedPositionSize"
// import { usePositionSize } from "../usePositionSize"
// import { BigNumber } from "ethers"

interface TransactionInfo {
    markPrice?: Big
    priceImpact?: string
    estimateGasFee?: Big
    fundingRatio?: string
}

function TxInfoTable(transactionInfo: TransactionInfo) {
    // // const fee: Big | null = useMemo(() => {
    // //     if (collateral !== null && selectedAmm !== null) {
    // //         const { tollRatio } = selectedAmm
    // //         const notional = collateral.mul(leverage)
    // //         const tollFee = notional.mul(tollRatio)
    // //         return tollFee
    // //     }
    // //     return null
    // // }, [collateral, leverage, selectedAmm])

    // // const entryPriceStr = useMemo(() => {
    // //     if (entryPrice !== null) {
    // //         if (inverse) {
    // //             return numberWithCommasUsdc(Big(1).div(entryPrice))
    // //         } else {
    // //             return numberWithCommasUsdc(entryPrice)
    // //         }
    // //     }
    // //     return "-"
    // // }, [entryPrice, inverse])

    // // const priceImpactStr = useMemo(() => {
    // //     if (entryPrice !== null && price !== null) {
    // //         const spotPrice = price
    // //         if (spotPrice.eq(0)) {
    // //             return "-"
    // //         }
    // //         return entryPrice.sub(spotPrice).div(spotPrice).mul(100).toFixed(2)
    // //     }
    // //     return "-"
    // // }, [entryPrice, price])

    // const feeStr = useMemo(() => {
    //     if (fee !== null) {
    //         return numberWithCommasUsdc(fee)
    //     }
    //     return "-"
    // }, [fee])

    // const totalStr = useMemo(() => {
    //     /* TODO: positionSize should only be null or Big */
    //     if (collateral !== null && fee !== null && positionSize !== "") {
    //         if (
    //             openedMargin !== null &&
    //             openedSize !== null &&
    //             outputPrice !== null &&
    //             unrealizedPnl !== null &&
    //             !openedSize.eq(0) &&
    //             side !== (openedSize.gt(0) ? Side.Long : Side.Short)
    //         ) {
    //             const b_positionSize = new Big(positionSize)
    //             if (b_positionSize.gt(openedSize.abs())) {
    //                 /** case:
    //                  * open an "opposite side" position
    //                  * and the "open size" is "bigger" than the "existing position" size */
    //                 /**
    //                  * collateralToPay
    //                  * = collateral - remainMargin
    //                  * = (positionNotionalDiff / leverage) - remainMargin
    //                  * = (newPositionNotional - oldPositionNotional) / leverage - remainMargin
    //                  * = collateral - (oldPositionNotional / leverage) - remainMargin
    //                  */
    //                 const remainMargin = openedMargin.add(unrealizedPnl)
    //                 const collateralToPay = collateral.sub(outputPrice.div(leverage)).sub(remainMargin)
    //                 return numberWithCommasUsdc(fee.add(collateralToPay))
    //             } else {
    //                 /** case:
    //                  * open an "opposite side" position
    //                  * and the "open size" is "small or equal" to the "existing position" size */
    //                 return numberWithCommasUsdc(fee)
    //             }
    //         } else {
    //             /** case:
    //              * no existing position
    //              * or open a "same side" position
    //              */
    //             return numberWithCommasUsdc(fee.add(collateral))
    //         }
    //     }
    //     return "-"
    // }, [collateral, leverage, openedMargin, openedSize, outputPrice, positionSize, side, unrealizedPnl])

    return (
        <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
            <Tbody>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Position Size (USD)
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {transactionInfo.markPrice?.toFixed(6)}
                    </Td>
                </Tr>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Entry Price
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {transactionInfo.priceImpact}
                    </Td>
                </Tr>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Price Impact
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {transactionInfo.estimateGasFee?.toFixed(6)}
                    </Td>
                </Tr>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Transaction Fee
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {transactionInfo?.fundingRatio}
                    </Td>
                </Tr>
                <Tr>
                    <Td pl={0} color="gray.200" borderBottom={0}>
                        Total Cost
                    </Td>
                    <Td isNumeric borderBottom={0}>
                        {transactionInfo?.fundingRatio}
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    )
}

export default TxInfoTable
