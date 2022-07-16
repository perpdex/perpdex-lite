import React from "react"
import { HStack, Box, Text, Center, VStack, Divider } from "@chakra-ui/react"
import { Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { TriangleDownIcon } from "@chakra-ui/icons"
import MarketTable from "./MarketTable"
import { numberWithCommas } from "../../../util/format"
import _ from "lodash"

function ChartHead() {
    const { currentMarketState, setCurrentMarket, marketStates } = PerpdexMarketContainer.useContainer()

    // const BaseSymbolIcon = getCurrencyIcon(currentMarketSummary.baseSymbolDisplay)

    return (
        <>
            <HStack spacing="24px" borderBottom="solid rgba(98, 126, 234, 0.6) 1px" px="20px">
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
                                                <Text>{currentMarketState.name}</Text>
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
                                        data={_.values(marketStates)}
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
                <Center h="100px" mx={10}>
                    <Divider orientation="vertical" borderColor="rgba(98, 126, 234, 0.6)" />
                </Center>
                <Box w="100%" alignSelf="center">
                    <HStack justifyContent="space-between" alignItems="center">
                        <VStack align="start">
                            <Text color={"gray.200"}>Mark Price</Text>
                            <Text>
                                {numberWithCommas(currentMarketState.markPriceDisplay)}{" "}
                                {currentMarketState.priceUnitDisplay}
                            </Text>
                        </VStack>
                        {/*TODO: implement*/}
                        {/*<VStack align="start">*/}
                        {/*    <Text color={"gray.200"}>Funding Rate</Text>*/}
                        {/*    <Text color={"#66BB74"}>0.0234</Text>*/}
                        {/*</VStack>*/}
                        <VStack align="start">
                            <Text color={"gray.200"}>24h Volume</Text>
                            <Text>
                                {numberWithCommas(currentMarketState.volume24h)} {currentMarketState.quoteSymbol}
                            </Text>
                        </VStack>
                    </HStack>
                </Box>
            </HStack>
        </>
    )
}

export default ChartHead
