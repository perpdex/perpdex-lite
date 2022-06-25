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

    // const handleOnClick = useCallback(async () => {
    //     if (address && currentMyTakerPositions && currentMyTakerPositions.notional && currentMyTakerPositions.size) {
    //         const { notional, size } = currentMyTakerPositions
    //         const slippageLimit = notional.abs().mul(slippage / 100)
    //         const quoteLimit = size.gt(0) ? notional.abs().sub(slippageLimit) : notional.abs().add(slippageLimit)

    //         // FIX: closePosition is not avaibale on the current contract
    //         closePosition(address, quoteLimit)
    //     }
    // }, [address, closePosition, currentMyTakerPositions, slippage])

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
                        {/* <VStack spacing={5}>
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
                                                {displayInfo.exitPriceStr}
                                                {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Margin</Td>
                                            <Td isNumeric>
                                                {displayInfo.marginStr}
                                                {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>PnL</Td>
                                            <Td isNumeric>
                                                {displayInfo.unrPnlStr}
                                                {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Transaction Fee</Td>
                                            <Td isNumeric>
                                                {displayInfo.feeStr} {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Total Value Received</Td>
                                            <Td isNumeric>
                                                {displayInfo.totalStr} {quoteAssetSymbol}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </Box>
                            <Divider />
                        </VStack> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            isFullWidth
                            colorScheme="blue"
                            size="md"
                            onClick={() => console.log("FIX")}
                            isLoading={isTxLoading}
                        >
                            Close Position
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        ),
        [isClosePositionModalOpen, closeClosePositionModal, baseAssetSymbol, isTxLoading],
    )
}

export default ClosePositionModal
