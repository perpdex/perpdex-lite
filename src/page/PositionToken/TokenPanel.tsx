import { Box, Button, SimpleGrid } from "@chakra-ui/react"
import { PerpdexLongTokenContainer } from "../../container/connection/perpdexLongTokenContainer"
import { Link as ReactLink } from "react-router-dom"

interface Props {
    marketAddress: string
}

function TokenPanel(props: Props) {
    const { longTokenStates } = PerpdexLongTokenContainer.useContainer()
    const longTokenState = longTokenStates[props.marketAddress]
    const linkTo = `/tokens/${props.marketAddress}`

    return (
        <Box bgGradient="linear(to-b, #627EEA80, #F9007780)" borderRadius={20}>
            <SimpleGrid width="100%" columns={1} spacing={6} padding={6}>
                <Box>{longTokenState.symbol}</Box>
                <Box>USD Value ${1.23}</Box>
                <Box>PerpDEX 1x long token equipped with LFF</Box>
                <Button as={ReactLink} colorScheme="pink" to={linkTo}>
                    Mint
                </Button>
            </SimpleGrid>
        </Box>
    )
}

export default TokenPanel
