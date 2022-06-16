import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import _ from "lodash"

function MarketSelector() {
    const { marketStates } = PerpdexMarketContainer.useContainer()

    const handleOnChange = () => console.log("FIX")

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange}>
                {_.map(marketStates, (marketState, marketAddress) => (
                    <option key={marketAddress} value={marketAddress}>
                        {marketState.quoteSymbol} / {marketState.baseSymbol} (inverse)
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
