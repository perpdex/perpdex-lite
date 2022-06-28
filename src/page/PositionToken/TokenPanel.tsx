import { Box, Button, SimpleGrid } from "@chakra-ui/react"
import { LongTokenState } from "../../constant/types"

interface Props {
    longTokenState: LongTokenState
}

function TokenPanel(props: Props) {
    return (
        <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
            <SimpleGrid width="100%" columns={1} spacing={6} padding={59}>
                <Box>{props.longTokenState.symbol}</Box>
                <Box>USD Value ${1.23}</Box>

                <Box>PerpDEX 1x long token equipped with LFF</Box>

                <Button colorScheme="pink">Mint</Button>
            </SimpleGrid>
        </Box>
    )
}

export default TokenPanel
