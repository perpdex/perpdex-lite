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
import { useCallback, useMemo } from "react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { Trade } from "container/perpetual/trade"
import { Transaction } from "container/connection/transaction"
import { numberWithCommasUsdc } from "util/format"
import { Position } from "container/perpetual/position"

function ClosePositionModal() {
    // address is base token address
    const {
        state: { baseAssetSymbol, quoteAssetSymbol, address, isClosePositionModalOpen },
        closeClosePositionModal,
    } = Position.useContainer()
    const { closePosition, currentMyTakerPositions } = PerpdexExchangeContainer.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()

    const { slippage } = Trade.useContainer() // FIX the slippage

    const handleOnClick = useCallback(async () => {
        if (address && currentMyTakerPositions && currentMyTakerPositions.notional && currentMyTakerPositions.size) {
            const { notional, size } = currentMyTakerPositions
            const slippageLimit = notional.abs().mul(slippage / 100)
            const quoteLimit = size.gt(0) ? notional.abs().sub(slippageLimit) : notional.abs().add(slippageLimit)
            closePosition(address, quoteLimit)
        }
    }, [address, closePosition, currentMyTakerPositions, slippage])

    /* prepare data for UI */
    const exitPriceStr = useMemo(() => {
        if (
            currentMyTakerPositions &&
            currentMyTakerPositions.notional.abs().gt(0) &&
            currentMyTakerPositions.size.abs().gt(0)
        ) {
            const { size, notional } = currentMyTakerPositions
            return numberWithCommasUsdc(size.div(notional).abs())
        }
        return "-"
    }, [currentMyTakerPositions])

    const totalStr = useMemo(() => {
        if (
            currentMyTakerPositions &&
            currentMyTakerPositions.margin &&
            currentMyTakerPositions.unrealizedPnl &&
            currentMyTakerPositions.fee
        ) {
            const { margin, unrealizedPnl, fee } = currentMyTakerPositions
            return numberWithCommasUsdc(margin.add(unrealizedPnl).sub(fee))
        }
        return "-"
    }, [currentMyTakerPositions])

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
                                                {(currentMyTakerPositions?.margin &&
                                                    numberWithCommasUsdc(currentMyTakerPositions.margin)) ||
                                                    "-"}{" "}
                                                {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>PnL</Td>
                                            <Td isNumeric>
                                                {currentMyTakerPositions?.unrealizedPnl.toFixed(2) || "-"}{" "}
                                                {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Transaction Fee</Td>
                                            <Td isNumeric>
                                                {currentMyTakerPositions?.fee.toFixed(2) || "-"} {quoteAssetSymbol}
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
            currentMyTakerPositions?.margin,
            currentMyTakerPositions?.unrealizedPnl,
            currentMyTakerPositions?.fee,
            totalStr,
            handleOnClick,
            isTxLoading,
        ],
    )
}

export default ClosePositionModal
