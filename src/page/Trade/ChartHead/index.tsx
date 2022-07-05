import React, { useMemo } from "react"
import { HStack, Box, Text, Center } from "@chakra-ui/react"

import { Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react"

import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { createMarketSummary } from "util/market"
import { TriangleDownIcon } from "@chakra-ui/icons"
import MarketTable from "./MarketTable"
import { MarketState } from "constant/types"

function ChartHead() {
    const { currentMarketState, setCurrentMarket, marketStates } = PerpdexMarketContainer.useContainer()

    const currentMarketSummary = useMemo(() => createMarketSummary(currentMarketState), [currentMarketState])

    // const BaseSymbolIcon = getCurrencyIcon(currentMarketSummary.baseSymbolDisplay)

    const marketSummary = useMemo(() => {
        const poolsArray: MarketState[] = Object.keys(marketStates).map((key: string) => marketStates[key])

        return poolsArray.map((pool: MarketState) => createMarketSummary(pool))
    }, [marketStates])

    return (
        <>
            <HStack spacing="24px" borderBottom="solid #627EEA 1px">
                <Popover trigger="hover" arrowSize={0}>
                    {({ onClose }) => (
                        <>
                            <PopoverTrigger>
                                <Center
                                    h="80px"
                                    pl="4"
                                    _hover={{ backgroundColor: "black.alpha800", opacity: "0.9", cursor: "pointer" }}
                                >
                                    <HStack spacing={2}>
                                        {currentMarketState && (
                                            <>
                                                {/* {BaseSymbolIcon && <BaseSymbolIcon width={8} height={8} />} */}
                                                <Text>{currentMarketSummary.marketName}</Text>
                                                <Box px="2">
                                                    <TriangleDownIcon w={3} h={3} />
                                                </Box>
                                            </>
                                        )}
                                    </HStack>
                                </Center>
                            </PopoverTrigger>
                            <PopoverContent transform="translate3d(0px, -12px, 0px) !important" bg="blackAlpha.700">
                                <PopoverBody>
                                    <MarketTable
                                        data={marketSummary}
                                        handleOnClick={(address: string) => {
                                            onClose()
                                            setCurrentMarket(address)
                                        }}
                                    />
                                </PopoverBody>
                            </PopoverContent>
                        </>
                    )}
                </Popover>
                <Box>
                    <Text fontSize="xl">{currentMarketSummary.markPrice}</Text>
                </Box>
            </HStack>
        </>
    )
}

export default ChartHead
