import { AddIcon, MinusIcon } from "@chakra-ui/icons"
import { Box, Button, Heading, HStack } from "@chakra-ui/react"

interface PositionProps {
    handleOnAddLiquidityClick: () => void
    handleOnRemoveLiquidityClick: () => void
}

function Position({ handleOnAddLiquidityClick, handleOnRemoveLiquidityClick }: PositionProps) {
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
