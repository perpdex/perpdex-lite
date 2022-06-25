import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/base/SmallFormLabel"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import _ from "lodash"

function MarketSelector() {
    const { marketStates, currentMarket, setCurrentMarket } = PerpdexMarketContainer.useContainer()

    const handleOnChange = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        ev.target.value && setCurrentMarket(ev.target.value)

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange}>
                {_.map(marketStates, (marketState, marketAddress) => (
                    <option key={marketAddress} value={marketAddress} selected={marketAddress === currentMarket}>
                        {marketState.quoteSymbol} / {marketState.baseSymbol} (inverse)
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
