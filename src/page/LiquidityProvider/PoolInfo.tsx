import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react"

interface PoolInfoState {
    quoteSymbol: string
    tvl: string
    volume24h: string
    markPrice: string
}

function PoolInfo({ quoteSymbol, tvl, volume24h, markPrice }: PoolInfoState) {
    console.log("PoolInfo", tvl, volume24h, markPrice)

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
            <Heading w="full" size="md" color="whiteAlpha.700">
                Pool Info
            </Heading>
            <SimpleGrid width="100%" columns={2}>
                <DataRow text="TVL" value={tvl} />
                <DataRow text="Volume (24h)" value={volume24h} />
                <DataRow text="24h Fees" value={`- ${quoteSymbol}`} />
                <DataRow text="Mark Price" value={`${markPrice} ${quoteSymbol}`} />
            </SimpleGrid>
        </>
    )
}

export default PoolInfo
