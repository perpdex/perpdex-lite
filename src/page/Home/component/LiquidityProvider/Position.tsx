import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"
import { LiquidityProvider } from "container/liquidityProvider"
import { useCallback } from "react"
import { Amm } from "../../../../container/amm"
import { ClearingHouse } from "../../../../container/clearingHouse"
import { bigNum2Big } from "../../../../util/format"
import { Contract } from "../../../../container/contract"
import { Connection } from "../../../../container/connection"

function Position() {
    const { account } = Connection.useContainer()
    const { perpdexExchange } = Contract.useContainer()
    const { selectedAmm } = Amm.useContainer()
    const baseTokenAddress = selectedAmm?.address
    const { removeLiquidity } = ClearingHouse.useContainer()

    const { openLiquidityProviderModal } = LiquidityProvider.useContainer()

    const handleOnAddLiquidityClick = useCallback(() => {
        openLiquidityProviderModal()
    }, [openLiquidityProviderModal])

    const handleOnRemoveLiquidityClick = useCallback(async () => {
        if (!perpdexExchange) return
        if (!account) return
        if (!baseTokenAddress) return

        // FIX
        const tmp = await perpdexExchange.getAccountValue(account)

        // const { liquidity: liquidityRaw } = await orderBook.getOpenOrder(account, baseTokenAddress)

        // const [quoteAmountRaw, quotePendingFee] = await orderBook.getTotalTokenAmountInPoolAndPendingFee(
        //     account,
        //     baseTokenAddress,
        //     false,
        // )
        // const [baseAmountRaw, basePendingFee] = await orderBook.getTotalTokenAmountInPoolAndPendingFee(
        //     account,
        //     baseTokenAddress,
        //     true,
        // )

        const liquidity = bigNum2Big(tmp)
        const baseAmount = bigNum2Big(tmp)
        const quoteAmount = bigNum2Big(tmp)

        removeLiquidity(baseTokenAddress, liquidity, baseAmount.mul(0.9), quoteAmount.mul(0.9))
    }, [perpdexExchange, account, baseTokenAddress, removeLiquidity])

    return (
        <>
            <Box width="100%">
                <HStack justifyContent="space-between">
                    <Heading size="sm">Liquidity Positions</Heading>
                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="pink"
                        variant="solid"
                        size="xs"
                        onClick={handleOnAddLiquidityClick}
                    >
                        Add Liquidity
                    </Button>
                    <Button
                        leftIcon={<MinusIcon />}
                        colorScheme="pink"
                        variant="solid"
                        size="xs"
                        onClick={handleOnRemoveLiquidityClick}
                    >
                        Remove All Liquidity
                    </Button>
                </HStack>
            </Box>
        </>
    )
}

export default Position
