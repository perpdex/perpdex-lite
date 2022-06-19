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
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Trade } from "container/perpetual/trade"
import { Transaction } from "container/connection/transaction"
import { numberWithCommasUsdc } from "util/format"
import Big from "big.js"
import { Position } from "container/perpetual/position"
import { PerpdexMarketContainer } from "../../container/connection/perpdexMarketContainer"

function ClosePositionModal() {
    // address is base token address
    const {
        state: { baseAssetSymbol, quoteAssetSymbol, address, isClosePositionModalOpen },
        closeClosePositionModal,
    } = Position.useContainer()
    const { closePosition, currentMyTakerInfo } = PerpdexExchangeContainer.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()
    const {
        currentMarketState: { markPrice },
    } = PerpdexMarketContainer.useContainer() // TODO: refactor (this modal shouldn't depend on global state)

    const { slippage } = Trade.useContainer()

    const closePositionInfo = useMemo(() => {
        if (!currentMyTakerInfo) return null

        const size = currentMyTakerInfo.baseBalanceShare
        const takerOpenNotional = currentMyTakerInfo.quoteBalance
        const margin = Big(0)

        if (size.eq(0)) return null

        const entryPrice = takerOpenNotional.abs().div(size.abs())
        if (!markPrice) return null

        const unrealizedPnl = markPrice.div(entryPrice).sub(1).mul(takerOpenNotional.mul(-1))

        return {
            notional: takerOpenNotional,
            size,
            margin,
            unrealizedPnl,
            fee: takerOpenNotional.mul(Big("0.003")),
        }
    }, [currentMyTakerInfo, markPrice])

    const handleOnClick = useCallback(async () => {
        if (address && closePositionInfo !== null && closePositionInfo.notional && closePositionInfo.size) {
            const { notional, size } = closePositionInfo
            const slippageLimit = notional.abs().mul(slippage / 100)
            const quoteLimit = size.gt(0) ? notional.abs().sub(slippageLimit) : notional.abs().add(slippageLimit)
            closePosition(address, quoteLimit)
        }
    }, [address, closePosition, closePositionInfo, slippage])

    /* prepare data for UI */
    const exitPriceStr = useMemo(() => {
        if (closePositionInfo === null) {
            return "-"
        }
        const { notional, size } = closePositionInfo
        if (notional.eq(0) || size.eq(0)) {
            return "-"
        }
        return numberWithCommasUsdc(size.div(notional).abs())
    }, [closePositionInfo])

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
                                                {exitPriceStr}
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
            isClosePositionModalOpen,
            closeClosePositionModal,
            baseAssetSymbol,
            exitPriceStr,
            quoteAssetSymbol,
            marginStr,
            pnlStr,
            feeStr,
            totalStr,
            handleOnClick,
            isTxLoading,
        ],
    )
}

export default ClosePositionModal
