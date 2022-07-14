import { Text, HStack, Box } from "@chakra-ui/react"
import React, { useCallback, useMemo } from "react"

import { Trade } from "container/perpetual/trade"
import Button from "component/base/Button"

// TODO: separate component and state
function Slippage() {
    const { slippage, setSlippage } = Trade.useContainer()

    const handleOnChange = useCallback(
        value => {
            if (value >= 0) {
                setSlippage(value)
            }
        },
        [setSlippage],
    )
    const handleOnClick = useCallback(
        value => {
            setSlippage(value)
        },
        [setSlippage],
    )
    return useMemo(
        () => (
            <Box w="100%">
                <HStack justifyContent="space-between">
                    <Text fontSize="md" color="white">
                        Slippage
                    </Text>
                    <Button
                        size="sm"
                        customType={slippage === 0.5 ? "base-blue" : "base-dark"}
                        text="0.5%"
                        borderRadius="20px"
                        onClick={() => handleOnClick(0.5)}
                    >
                        0.5%
                    </Button>
                    <Button
                        size="sm"
                        customType={slippage === 1 ? "base-blue" : "base-dark"}
                        text="1%"
                        borderRadius="20px"
                        onClick={() => handleOnClick(1)}
                    >
                        1%
                    </Button>
                    <Button
                        size="sm"
                        customType={slippage === 1.5 ? "base-blue" : "base-dark"}
                        text="1.5%"
                        borderRadius="20px"
                        onClick={() => handleOnClick(1.5)}
                    >
                        1.5%
                    </Button>
                    <Button
                        size="sm"
                        customType={slippage === 2 ? "base-blue" : "base-dark"}
                        text="2%"
                        borderRadius="20px"
                        onClick={() => handleOnClick(2)}
                    >
                        2%
                    </Button>
                </HStack>
            </Box>
        ),
        [handleOnClick, slippage],
    )
}

export default Slippage
