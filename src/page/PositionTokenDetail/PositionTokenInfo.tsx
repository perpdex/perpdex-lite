import React from "react"
import { Grid, GridItem, Text } from "@chakra-ui/react"

import BorderFramePanel from "component/frames/BorderFramePanel"
import { LongTokenState } from "constant/types"
import { numberWithCommas } from "../../util/format"

interface PositionTokenInfoState {
    longTokenState: LongTokenState
}

function PositionTokenInfo({ longTokenState }: PositionTokenInfoState) {
    return (
        <BorderFramePanel p={10}>
            <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                <GridItem colSpan={2}>
                    <Text fontSize="xl">Token Info</Text>
                </GridItem>
                <Text>Token Info Symbol</Text>
                <Text align="end">{longTokenState?.symbol}</Text>
                <Text>Name</Text>
                <Text align="end"> {longTokenState?.name}</Text>
                <Text>Input Token</Text>
                <Text align="end"> {longTokenState?.assetSymbol}</Text>
                <Text>Total Supply</Text>{" "}
                <Text align="end">
                    {longTokenState?.totalSupply?.toString()} {longTokenState?.symbol}
                </Text>
                <Text>TVL</Text>{" "}
                <Text align="end">
                    {numberWithCommas(longTokenState?.totalAssets)} {longTokenState?.assetSymbol}
                </Text>
                <Text>TVL(USD)</Text>
                <Text align="end">$ {numberWithCommas(longTokenState?.totalAssets)}</Text>
                <Text>Address</Text>
                <Text align="end" wordBreak="break-all">
                    {" "}
                    {longTokenState?.address}
                </Text>
            </Grid>
        </BorderFramePanel>
    )
}

export default PositionTokenInfo
