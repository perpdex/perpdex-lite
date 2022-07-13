import React, { useState } from "react"
import { VStack, Box, Text, HStack } from "@chakra-ui/react"

import { CurrencyIcon } from "component/Icon"
import DiscreteInputModifier from "component/base/DiscreteInputModifier"
import { BIG_ZERO } from "constant"
import SideSwitcher from "component/base/SideSwitcher"
import Big from "big.js"
import Button from "component/base/Button"
import { formattedNumberWithCommas } from "util/format"

interface PositionTokenHandlerState {
    isMint: boolean
    currentSymbol?: string
    currentMaxValue?: Big
    doSwitchToMint: (val: boolean) => void
    handleProceed: (val: Big) => void
}

function PositionTokenHandler({
    isMint,
    currentSymbol,
    currentMaxValue,
    doSwitchToMint,
    handleProceed,
}: PositionTokenHandlerState) {
    const [inputVal, setInputVal] = useState<Big>(BIG_ZERO)

    const handleSwitch = (val: boolean) => {
        setInputVal(BIG_ZERO)
        doSwitchToMint(val)
    }

    return (
        <>
            <SideSwitcher isBuy={isMint} longText="Mint" shortText="Redeem" doSwitchToBuy={handleSwitch} />
            <Box
                w="100%"
                borderColor="#728BEC"
                borderWidth={{ base: "0px", md: "1px" }}
                borderRadius="10px"
                p={20}
                mx={{ base: "auto", md: "0" }}
            >
                <HStack justifyContent={"center"}>
                    <VStack mr="10px">
                        <HStack>
                            <CurrencyIcon symbol={currentSymbol || ""} boxSize={6} />
                            <Text fontSize={"lg"}>{currentSymbol || ""}</Text>
                        </HStack>
                        <HStack>
                            <Text fontSize={"xs"}>Available:</Text>
                            <Text fontSize={"xs"}>{formattedNumberWithCommas(currentMaxValue)}</Text>
                        </HStack>
                    </VStack>
                    <VStack>
                        <DiscreteInputModifier
                            uiType="white-base"
                            inputLabel="test"
                            assetSymbol="usd"
                            value={inputVal}
                            maxValue={currentMaxValue || BIG_ZERO}
                            handleUpdate={val => setInputVal(val)}
                        />
                    </VStack>
                </HStack>
            </Box>
            <Button
                customType="base-blue"
                size="lg"
                text="Proceed"
                w="60%"
                isDisabled={inputVal.eq(0)}
                onClick={() => handleProceed(inputVal)}
                mb="30px"
            />
        </>
    )
}

export default PositionTokenHandler
