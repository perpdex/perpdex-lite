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
// import Position from "./Position"
import Slippage from "./Slippage"
import { useMemo, useState } from "react"
import { LiquidityProvider } from "container/liquidityProvider"
import Big from "big.js"
import { PerpdexMarketContainer } from "../../container/perpdexMarketContainer"
import { AddIcon } from "@chakra-ui/icons"
// import { PerpdexExchangeContainer } from "../../container/perpdexExchangeContainer"

function LiquidityProviderModal() {
    const {
        state: { isLiquidityProviderModalOpen },
        closeLiquidityProviderModal,
    } = LiquidityProvider.useContainer()

    // const { state: { currentMarket } } = Market.useContainer()
    // const ammAddress = selectedAmm?.address || ""
    // const ammName = selectedAmm?.baseAssetSymbol || ""
    // const indexPrice = selectedAmm?.indexPrice || Big(0)
    // const { price } = useRealtimeAmm(ammAddress, ammName)

    const [collateral, setCollateral] = useState<Big>(Big(0))

    const baseAmount = useMemo(() => {
        // if (price && price.gt(0)) {
        //     return collateral.div(price)
        // } else if (indexPrice.gt(0)) {
        //     return collateral.div(indexPrice)
        // } else {
        //     return Big(0)
        // }
        return Big(0)
    }, [])

    // const handleAddLiquidity = useCallback(
    //     e => {
    //         addLiquidity(ammAddress, baseAmount, collateral, baseAmount.mul(0.9), collateral.mul(0.9))
    //     },
    //     [addLiquidity, ammAddress, baseAmount, collateral],
    // )
    const handleAddLiquidity = () => console.log("FIX")

    return (
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
    )
}

export default LiquidityProviderModal
