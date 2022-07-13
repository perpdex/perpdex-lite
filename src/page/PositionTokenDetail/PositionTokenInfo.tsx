import React from "react"
import { Grid, GridItem, Text } from "@chakra-ui/react"

import BorderFramePanel from "component/frames/BorderFramePanel"
import { LongTokenState } from "constant/types"

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
        </BorderFramePanel>
    )
}

export default PositionTokenInfo
