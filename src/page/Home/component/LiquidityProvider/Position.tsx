import { AddIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"
import { LiquidityProvider } from "container/liquidityProvider"
import { useCallback } from "react"

function Position() {
    const { openLiquidityProviderModal } = LiquidityProvider.useContainer()
    const handleOnAddLiquidityClick = useCallback(() => {
        openLiquidityProviderModal()
    }, [openLiquidityProviderModal])

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
                </HStack>
            </Box>
        </>
    )
}

export default Position
