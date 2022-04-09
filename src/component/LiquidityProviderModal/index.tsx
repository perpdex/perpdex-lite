import {
    Divider,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    VStack,
    Box,
    Button,
} from "@chakra-ui/react"
import MarketSelector from "./MarketSelector"
import Collateral from "./Collateral"
import Position from "./Position"
import Slippage from "./Slippage"
import { useCallback, useMemo, useState } from "react"
import { LiquidityProvider } from "container/liquidityProvider"
import Big from "big.js"
import { Dir, Network, Side, USDC_PRECISION } from "../../constant"
import { Amm } from "../../container/amm"
import { useRealtimeAmm } from "../../hook/useRealtimeAmm"
import { AddIcon } from "@chakra-ui/icons"
import { formatInput } from "../../util/format"
import { ClearingHouse } from "../../container/clearingHouse"

function LiquidityProviderModal() {
    const {
        state: { isLiquidityProviderModalOpen },
        closeLiquidityProviderModal,
    } = LiquidityProvider.useContainer()

    const { selectedAmm } = Amm.useContainer()
    const ammAddress = selectedAmm?.address || ""
    const ammName = selectedAmm?.baseAssetSymbol || ""
    const { price } = useRealtimeAmm(ammAddress, ammName)
    const { addLiquidity } = ClearingHouse.useContainer()

    const [collateral, setCollateral] = useState<Big>(Big(0))

    const baseAmount = useMemo(() => {
        if (price && price.gt(0)) {
            return collateral.div(price)
        } else {
            return Big(0)
        }
    }, [collateral, price])

    const handleAddLiquidity = useCallback(
        e => {
            addLiquidity(ammAddress, baseAmount, collateral, baseAmount.mul(0.9), collateral.mul(0.9))
        },
        [addLiquidity, ammAddress, baseAmount, collateral],
    )

    return useMemo(
        () => (
            <Modal
                isCentered
                motionPreset="slideInBottom"
                isOpen={isLiquidityProviderModalOpen}
                onClose={closeLiquidityProviderModal}
            >
                <ModalOverlay />
                <ModalContent borderRadius="2xl" pb={3}>
                    <ModalHeader>Add Liquidity</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={5}>
                            <MarketSelector />
                            <Collateral onChange={setCollateral} />
                            <Box>baseAmount: {baseAmount.toString()}</Box>
                            {/*<Position/>*/}
                            <Divider />
                            <Slippage />
                            <Divider />
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={handleAddLiquidity}
                            isFullWidth
                            size="md"
                            leftIcon={<AddIcon />}
                            colorScheme="pink"
                            variant="solid"
                        >
                            Add Liquidity
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        ),
        [closeLiquidityProviderModal, isLiquidityProviderModalOpen],
    )
}

export default LiquidityProviderModal
