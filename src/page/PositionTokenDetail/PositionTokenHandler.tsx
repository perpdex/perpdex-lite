import React, { useMemo, useState } from "react"
import { VStack, Text, HStack } from "@chakra-ui/react"

// import { CurrencyIcon } from "component/Icon"
import DiscreteInputModifier from "component/base/DiscreteInputModifier"
import { BIG_ZERO } from "constant"
import SideSwitcher from "component/base/SideSwitcher"
import Big from "big.js"
import Button from "component/base/Button"
import { formattedNumberWithCommas } from "util/format"
import BorderFramePanel from "component/frames/BorderFramePanel"

interface PositionTokenHandlerState {
    isMint: boolean
    tokenSymbol?: string
    quoteSymbol?: string
    currentMaxValue?: Big
    doSwitchToMint: (val: boolean) => void
    handleProceed: (val: Big) => void
}

function PositionTokenHandler({
    isMint,
    tokenSymbol,
    quoteSymbol,
    currentMaxValue,
    doSwitchToMint,
    handleProceed,
}: PositionTokenHandlerState) {
    const [inputVal, setInputVal] = useState<Big | undefined>(undefined)

    const handleSwitch = (val: boolean) => {
        setInputVal(undefined)
        doSwitchToMint(val)
    }

    const assetSymbol = useMemo(() => {
        return quoteSymbol && tokenSymbol ? (isMint ? quoteSymbol : tokenSymbol) : ""
    }, [isMint, quoteSymbol, tokenSymbol])

    return (
        <>
            <SideSwitcher isBuy={isMint} longText="Mint" shortText="Redeem" doSwitchToBuy={handleSwitch} />
            <BorderFramePanel p={20}>
                <HStack justifyContent={"center"}>
                    <VStack mr="10px">
                        <HStack>
                            {/* <CurrencyIcon symbol={tokenSymbol} boxSize={6} /> */}
                            <Text fontSize={"lg"}>{tokenSymbol}</Text>
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
                            assetSymbol={assetSymbol}
                            value={inputVal}
                            maxValue={currentMaxValue || BIG_ZERO}
                            handleUpdate={val => setInputVal(val)}
                        />
                    </VStack>
                </HStack>
            </BorderFramePanel>
            <Button
                customType="base-blue"
                size="lg"
                text="Proceed"
                w="60%"
                isDisabled={!inputVal || inputVal.eq(0) || (currentMaxValue && inputVal.gt(currentMaxValue))}
                onClick={() => inputVal && handleProceed(inputVal)}
                mb="30px"
            />
        </>
    )
}

export default PositionTokenHandler
