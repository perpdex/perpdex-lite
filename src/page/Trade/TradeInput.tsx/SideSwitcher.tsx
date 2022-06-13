import { ButtonGroup, Button } from "@chakra-ui/react"
import { useCallback } from "react"
import { Trade } from "container/trade"

function SideSwitcher() {
    // isBaseToQuote is true => short
    const { isBaseToQuote, setIsBaseToQuote } = Trade.useContainer()

    const handleLongOnClick = useCallback(() => {
        if (isBaseToQuote) {
            setIsBaseToQuote(false)
        }
    }, [isBaseToQuote, setIsBaseToQuote])

    const handleShortOnClick = useCallback(() => {
        if (!isBaseToQuote) {
            setIsBaseToQuote(true)
        }
    }, [isBaseToQuote, setIsBaseToQuote])

    return (
        <ButtonGroup w="100%" isAttached variant="solid">
            <Button
                size="sm"
                isFullWidth
                onClick={handleLongOnClick}
                colorScheme={!isBaseToQuote ? "green" : "gray"}
                mr="-px"
                variant="solid"
            >
                Buy / Long
            </Button>
            <Button size="sm" isFullWidth onClick={handleShortOnClick} colorScheme={isBaseToQuote ? "red" : "gray"}>
                Sell / Short
            </Button>
        </ButtonGroup>
    )
}

export default SideSwitcher
