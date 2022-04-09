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
import { Contract as MulticallContract } from "ethers-multicall"
import { PnlCalcOption } from "constant/position"
import { ClearingHouse } from "container/clearingHouse"
import { Trade } from "container/trade"
import { Transaction } from "container/transaction"
import { Connection } from "container/connection"
import { NewContract } from "container/newContract"
import { decimal2Big, big2Decimal, numberWithCommasUsdc, bigNum2Big } from "util/format"
import AmmArtifact from "@perp/contract/build/contracts/src/Amm.sol/Amm.json"
import ClearingHouseViewerArtifact from "@perp/contract/build/contracts/src/ClearingHouseViewer.sol/ClearingHouseViewer.json"
import { useInterval } from "hook/useInterval"
import Big from "big.js"
import { Dir } from "constant"
import { Position } from "container/position"

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
    const { account, multicallNetworkProvider } = Connection.useContainer()
    const { addressMap } = NewContract.useContainer()
    const { closePosition } = ClearingHouse.useContainer()
    const { isLoading: isTxLoading } = Transaction.useContainer()

    const { slippage } = Trade.useContainer()

    const [closePositionInfo, setClosePositionInfo] = useState<ClosePositionInfo | null>(null)

    const handleOnClick = useCallback(async () => {
        if (address && closePositionInfo !== null && closePositionInfo.notional && closePositionInfo.size) {
            const { notional, size } = closePositionInfo
            const slippageLimit = notional.mul(slippage / 100)
            const quoteLimit = size.gt(0) ? notional.sub(slippageLimit) : notional.add(slippageLimit)
            closePosition(address, quoteLimit)
        }
    }, [address, closePosition, closePositionInfo, slippage])

    const getClosePositionInfo = useCallback(async () => {
        if (account && addressMap && address && multicallNetworkProvider) {
            /* get { size, margin, unrealizedPnl } from clearingHouseViewerContract */
            // const clearingHouseViewerContract = new MulticallContract(
            //     addressMap.ClearingHouseViewer,
            //     ClearingHouseViewerArtifact.abi,
            // )
            // const rawClearingHouseViewerData = await multicallNetworkProvider.all([
            //     clearingHouseViewerContract.getPersonalPositionWithFundingPayment(address, account),
            //     clearingHouseViewerContract.getUnrealizedPnl(address, account, PnlCalcOption.SpotPrice),
            // ])

            const size = Big(1)
            const margin = Big(2)
            const unrealizedPnl = Big(3)

            /* get { notional, tollRatio, spreadRatio } */
            // const ammContract = new MulticallContract(address, AmmArtifact.abi)
            // const dir: Dir = size.gt(0) ? Dir.AddToAmm : Dir.RemoveFromAmm
            // const rawAmmData = await multicallNetworkProvider.all([
            //     ammContract.getOutputPrice(dir, big2Decimal(size.abs())),
            //     ammContract.tollRatio(),
            // ])
            // const [notional, tollRatio] = rawAmmData
            const b_tollRatio = Big("0.003")
            const b_notional = Big(1)

            /* calculate the toll fee for staker and the spread fee for insurance fund */
            const tollFee = b_notional.mul(b_tollRatio)
            const fee = tollFee

            const _closePositionInfo = {
                notional: b_notional,
                size,
                margin,
                unrealizedPnl,
                fee,
            }

            setClosePositionInfo(_closePositionInfo)
        } else {
            setClosePositionInfo(null)
        }
    }, [account, address, addressMap, multicallNetworkProvider])

    useEffect(() => {
        getClosePositionInfo()
    }, [getClosePositionInfo])

    /**
     * NOTE: higher frequency of info updating
     * update trader's position info per 2s
     */
    useInterval(getClosePositionInfo, 2000)

    /* prepare data for UI */
    const exitPriceStr = useMemo(() => {
        if (closePositionInfo === null) {
            return "-"
        }
        const { notional, size } = closePositionInfo
        if (size.eq(0)) {
            return "-"
        }
        return numberWithCommasUsdc(notional.div(size.abs()))
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
                                                {exitPriceStr} {quoteAssetSymbol}
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
            exitPriceStr,
            feeStr,
            handleOnClick,
            isClosePositionModalOpen,
            isTxLoading,
            marginStr,
            pnlStr,
            totalStr,
        ],
    )
}

export default ClosePositionModal
