import React, { useMemo, useState } from "react"
import { VStack, Flex, Box, Text, Grid, GridItem, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import { useHistory, useParams } from "react-router-dom"
import PositionTokenHandler from "./PositionTokenHandler"
import Big from "big.js"

type RouterParams = {
    marketAddress: string
}

function PositionTokenDetail() {
    const { marketAddress } = useParams<RouterParams>()
    const history = useHistory()
    const [isMint, setIsMint] = useState<boolean>(true)

    const { longTokenStates, deposit, redeem } = PerpdexLongTokenContainer.useContainer()
    const longTokenState = longTokenStates[marketAddress]

    console.log("longTokenSate", longTokenState)

    const longTokenInfo = useMemo(() => {
        if (longTokenState) {
            const { assetSymbol, symbol, maxMint, maxRedeem } = longTokenState

            return {
                address: marketAddress,
                assetSymbol,
                symbol,
                maxMint,
                maxRedeem,
            }
        }
    }, [longTokenState, marketAddress])

    const doSwitchToMint = (val: boolean) => setIsMint(val)

    const handleProceed = (val: Big) => {
        if (longTokenInfo) {
            isMint ? deposit(longTokenInfo.address, val) : redeem(longTokenInfo.address, val)
        }
    }

    return (
        <FrameContainer>
            <Flex direction={{ base: "column", lg: "row" }} width="100%">
                <VStack flex="50" spacing={10} mx={10}>
                    <Box mr="auto">
                        <Text as="button" onClick={history.goBack}>
                            ←Back
                        </Text>
                    </Box>
                    <PositionTokenHandler
                        isMint={isMint}
                        doSwitchToMint={doSwitchToMint}
                        tokenSymbol={longTokenInfo?.symbol}
                        quoteSymbol={longTokenInfo?.assetSymbol}
                        currentMaxValue={isMint ? longTokenInfo?.maxMint : longTokenInfo?.maxRedeem}
                        handleProceed={handleProceed}
                    />
                </VStack>
                <VStack flex="50" spacing={10}>
                    <Grid
                        templateColumns="repeat(2, 1fr)"
                        borderColor="#728BEC"
                        borderWidth={{ base: "0px", md: "1px" }}
                        borderRadius="10px"
                        p={10}
                        gap={2}
                    >
                        <GridItem colSpan={2}>
                            <Text fontSize="xl">Token Info</Text>
                        </GridItem>
                        <Text>Token Info Symbol</Text>
                        <Text align="end">{longTokenState?.symbol}</Text>
                        <Text>Name</Text>
                        <Text align="end"> {longTokenState?.name}</Text>
                        <Text>Input Token</Text>
                        <Text align="end"> {longTokenState?.assetSymbol}</Text>
                        <Text>Total Supply</Text> <Text align="end">{longTokenState?.totalSupply?.toString()}</Text>
                        <Text>TODO:</Text>
                        <Text align="end">TODO:</Text>
                        <Text>TVL</Text>{" "}
                        <Text align="end">
                            {longTokenState?.totalAssets?.toString()} {longTokenState?.assetSymbol}
                        </Text>
                        <Text>TVL(USD)</Text>
                        <Text align="end">$ {longTokenState?.totalAssets?.toString()}</Text>
                        <Text>Address</Text>
                        <Text align="end" wordBreak="break-all">
                            {" "}
                            {longTokenState?.address}
                        </Text>
                    </Grid>
                    <Box
                        w="100%"
                        borderColor="#728BEC"
                        borderWidth={{ base: "0px", md: "1px" }}
                        borderRadius="10px"
                        p={6}
                        mx={{ base: "auto", md: "0" }}
                    >
                        <Text fontSize="xl">Order History</Text>
                        <Table variant="simple" overflowY="scroll">
                            <Thead>
                                <Tr>
                                    <Th border="0px" pl={0}>
                                        Price(USD)
                                    </Th>
                                    <Th border="0px">Size</Th>
                                    <Th border="0px">Time</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                <Tr>
                                    <Td border="0px" pl={0}>
                                        392.21
                                    </Td>
                                    <Td border="0px">1.2</Td>
                                    <Td border="0px">13:17:21</Td>
                                </Tr>
                            </Tbody>
                        </Table>
                    </Box>
                </VStack>
            </Flex>
        </FrameContainer>
    )
}

export default PositionTokenDetail
