import React, { useEffect, useState } from "react"
import { VStack, Flex, Box, HStack, Divider } from "@chakra-ui/react"

import ChartHead from "./ChartHead"
import FrameContainer from "component/frames/FrameContainer"
import TradeInput from "./TradeInput"
import PositionTab from "./PositionTab"
import LightWeightChart from "./LightWeightChart"
import OrderHistory from "./OrderHistory"
import AccountSummary from "./AccountSummary"

function Trade() {
    const [height, setHeight] = useState<number | undefined>(0)
    const divRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (divRef.current) {
            setHeight(divRef.current.offsetHeight)
        }
    }, [])

    return (
        <FrameContainer removeMarginTop>
            <Flex direction={{ base: "column", lg: "row" }}>
                <Box flex="1">
                    <Flex direction={{ base: "column", lg: "row" }} alignItems="flex-start">
                        <VStack alignItems="stretch">
                            <ChartHead />
                            <Box width={600} height={400}>
                                <LightWeightChart />
                            </Box>
                        </VStack>
                        <OrderHistory />
                    </Flex>
                    <Divider
                        borderColor="#627EEA"
                        sx={{
                            "@media screen and (max-width: 61em)": {
                                display: "none",
                            },
                        }}
                    />
                    <PositionTab />
                </Box>
                <Box ref={divRef} w="100%">
                    <HStack spacing={8} justifyContent="flex-start">
                        <Divider
                            orientation="vertical"
                            border="1px"
                            borderColor="rgba(98, 126, 234, 0.6)"
                            h={height}
                            sx={{
                                "@media screen and (max-width: 61em)": {
                                    display: "none",
                                },
                            }}
                        />
                        <VStack spacing={10} p={0} pt={5} alignItems="flex-start">
                            <TradeInput />
                            <AccountSummary />
                        </VStack>
                    </HStack>
                </Box>
            </Flex>
        </FrameContainer>
    )
}

export default Trade
