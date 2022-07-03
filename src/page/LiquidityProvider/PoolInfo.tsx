import { Box, SimpleGrid, Text } from "@chakra-ui/react"
import CardHeading from "component/base/CardHeading"
import { MarketState } from "../../constant/types"
import { numberWithCommas } from "../../util/format"

interface Props {
    marketState: MarketState
    tvl: string
    volume24h: string
}

function PoolInfo({ marketState, tvl, volume24h }: Props) {
    const DataRow = (data: { text: string; value: string }) => (
        <>
            <Box mb="2">
                <InfoDataText text={data.text} />
            </Box>
            <Box ml="auto" mr={0} mb="2">
                <InfoDataText text={data.value} />
            </Box>
        </>
    )

    const InfoDataText = (data: { text: string }) => (
        <Text fontSize="md" fontWeight="bold">
            {data.text}
        </Text>
    )

    return (
        <>
            <CardHeading text="Pool Info" />
            <SimpleGrid width="100%" columns={2}>
                <DataRow text="TVL" value={tvl} />
                <DataRow text="Volume (24h)" value={volume24h} />
                <DataRow text="24h Fees" value={`- ${marketState.quoteSymbol}`} />
                <DataRow
                    text="Mark Price"
                    value={`${numberWithCommas(marketState.markPriceDisplay)} ${marketState.baseSymbolDisplay}/${
                        marketState.quoteSymbolDisplay
                    }`}
                />
            </SimpleGrid>
        </>
    )
}

export default PoolInfo
