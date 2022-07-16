import { FormControl, HStack, Select, Text, VStack } from "@chakra-ui/react"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import _ from "lodash"
import { PoolSummary } from "../../../constant/types"
import { useMemo } from "react"
import { createPoolSummary } from "../../../util/market"
import { CurrencyIcon } from "component/Icon"

function MarketSelector() {
    const { marketStates, setCurrentMarket, currentMarket } = PerpdexMarketContainer.useContainer()

    const poolSummary: { [key: string]: PoolSummary } = useMemo(() => {
        return _.mapValues(marketStates, createPoolSummary)
    }, [marketStates])

    const handleOnChange = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        ev.target.value && setCurrentMarket(ev.target.value)

    return (
        <FormControl id="market">
            <VStack>
                <HStack>
                    <CurrencyIcon symbol={"ETH"} boxSize={6} mr={1} />
                    <Select onChange={handleOnChange} border="0px">
                        {_.map(marketStates, (marketState, marketAddress) => (
                            <option
                                key={marketAddress}
                                value={marketAddress}
                                selected={marketAddress === currentMarket}
                            >
                                {marketState.name}
                            </option>
                        ))}
                    </Select>
                </HStack>
                {currentMarket && <Text>{marketStates[currentMarket].name}</Text>}
            </VStack>
        </FormControl>
    )
}

export default MarketSelector
