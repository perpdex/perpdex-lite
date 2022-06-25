import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/base/SmallFormLabel"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import _ from "lodash"

function MarketSelector() {
    const { marketStates, setCurrentMarket, currentMarket } = PerpdexMarketContainer.useContainer()

    const handleOnChange = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        ev.target.value && setCurrentMarket(ev.target.value)

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange}>
                {_.map(marketStates, (marketState, marketAddress) => (
                    <option key={marketAddress} value={marketAddress} selected={marketAddress === currentMarket}>
                        {marketState.inverse && `${marketState.quoteSymbol} / ${marketState.baseSymbol} (inverse)`}
                        {!marketState.inverse && `${marketState.baseSymbol} / ${marketState.quoteSymbol}`}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
