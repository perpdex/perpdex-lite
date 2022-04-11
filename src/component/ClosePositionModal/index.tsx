import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Heading,
    Box,
    Table,
    Tbody,
    Tr,
    Td,
    Divider,
    ModalFooter,
    Button,
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"
// import { PnlCalcOption } from "constant/position"
import { ClearingHouse } from "container/clearingHouse"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { Connection } from "container/connection"
import { NewContract } from "container/newContract"
import { numberWithCommasUsdc, bigNum2Big } from "util/format"
// import AmmArtifact from "@perp/contract/build/contracts/src/Amm.sol/Amm.json"
// import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { useInterval } from "hook/useInterval"
import Big from "big.js"
import { Position } from "container/position"
import { useRealtimeAmm } from "../../hook/useRealtimeAmm"

interface ClosePositionInfo {
    notional: Big
    size: Big
    margin: Big
    unrealizedPnl: Big
    fee: Big
}

function ClosePositionModal() {
    // address is base token address
    const {
        state: { baseAssetSymbol, quoteAssetSymbol, address, isClosePositionModalOpen },
        closeClosePositionModal,
    } = Position.useContainer()
    const { account } = Connection.useContainer()
    const { accountBalance } = NewContract.useContainer()
    const { closePosition } = ClearingHouse.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()
    const { price } = useRealtimeAmm(address, baseAssetSymbol)

    const { slippage } = Trade.useContainer()

    const [closePositionInfo, setClosePositionInfo] = useState<ClosePositionInfo | null>(null)

    const handleOnClick = useCallback(async () => {
        if (address && closePositionInfo !== null && closePositionInfo.notional && closePositionInfo.size) {
            const { notional, size } = closePositionInfo
            const slippageLimit = notional.abs().mul(slippage / 100)
            const quoteLimit = size.gt(0) ? notional.abs().sub(slippageLimit) : notional.abs().add(slippageLimit)
            closePosition(address, quoteLimit)
        }
    }, [address, closePosition, closePositionInfo, slippage])

    const getClosePositionInfo = useCallback(async () => {
        if (!account) return
        if (!accountBalance) return
        if (!address) return
        if (!price) return

        const [
            takerPositionSizeRaw,
            takerOpenNotionalRaw,
            // lastTwPremiumGrowthGlobalX96,
        ] = await accountBalance.getAccountInfo(account, address)

        const size = bigNum2Big(takerPositionSizeRaw)
        const takerOpenNotional = bigNum2Big(takerOpenNotionalRaw)
        const margin = Big(0)

        if (size.eq(0)) return

        const entryPrice = takerOpenNotional.abs().div(size.abs())
        const unrealizedPnl = price.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))

        const info = {
            notional: takerOpenNotional,
            size,
            margin,
            unrealizedPnl,
            fee: takerOpenNotional.mul(Big("0.003")),
        }

        setClosePositionInfo(info)
    }, [account, accountBalance, address, price])

    useEffect(() => {
        getClosePositionInfo()
    }, [getClosePositionInfo])

    /**
     * NOTE: higher frequency of info updating
     * update trader's position info per 2s
     */
    useInterval(getClosePositionInfo, 2000)

    /* prepare data for UI */
    // const exitPriceStr = useMemo(() => {
    //     if (closePositionInfo === null) {
    //         return "-"
    //     }
    //     const { notional, size } = closePositionInfo
    //     if (size.eq(0)) {
    //         return "-"
    //     }
    //     return numberWithCommasUsdc(notional.div(size.abs()))
    // }, [closePositionInfo])
    const pnlStr = useMemo(() => {
        if (closePositionInfo !== null && closePositionInfo.unrealizedPnl) {
            return closePositionInfo.unrealizedPnl.toFixed(2)
        }
        return "-"
    }, [closePositionInfo])
    const marginStr = useMemo(() => {
        if (closePositionInfo !== null && closePositionInfo.margin) {
            return numberWithCommasUsdc(closePositionInfo.margin)
        }
        return "-"
    }, [closePositionInfo])
    const feeStr = useMemo(() => {
        if (closePositionInfo !== null && closePositionInfo.fee) {
            return closePositionInfo.fee.toFixed(2)
        }
        return "-"
    }, [closePositionInfo])
    const totalStr = useMemo(() => {
        if (
            closePositionInfo !== null &&
            closePositionInfo.margin &&
            closePositionInfo.unrealizedPnl &&
            closePositionInfo.fee
        ) {
            const { margin, unrealizedPnl, fee } = closePositionInfo
            return numberWithCommasUsdc(margin.add(unrealizedPnl).sub(fee))
        }
        return "-"
    }, [closePositionInfo])

    return useMemo(
        () => (
            <Modal
                isCentered
                motionPreset="slideInBottom"
                isOpen={isClosePositionModalOpen}
                onClose={closeClosePositionModal}
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Close Position ({baseAssetSymbol})</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <Heading w="full" size="sm">
                                Transaction Summary
                            </Heading>
                            <Box
                                width="100%"
                                borderStyle="solid"
                                borderWidth="1px"
                                borderColor="gray.200"
                                borderRadius="12px"
                            >
                                <Table size="sm" borderRadius="12px" overflow="hidden" w="100%" variant="simple">
                                    <Tbody>
                                        <Tr fontWeight="bold">
                                            <Td>Exit Price</Td>
                                            <Td isNumeric>
                                                {/*{exitPriceStr} */}
                                                {price?.toFixed(2)}
                                                {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Margin</Td>
                                            <Td isNumeric>
                                                {marginStr} {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>PnL</Td>
                                            <Td isNumeric>
                                                {pnlStr} {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Transaction Fee</Td>
                                            <Td isNumeric>
                                                {feeStr} {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Total Value Received</Td>
                                            <Td isNumeric>
                                                {totalStr} {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                            <Divider />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isFullWidth
                            colorScheme="blue"
                            size="md"
                            onClick={handleOnClick}
                            isLoading={isTxLoading}
                        >
                            Close Position
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        ),
        [
            baseAssetSymbol,
            quoteAssetSymbol,
            closeClosePositionModal,
            feeStr,
            handleOnClick,
            isClosePositionModalOpen,
            isTxLoading,
            marginStr,
            pnlStr,
            totalStr,
            price,
        ],
    )
}

export default ClosePositionModal
