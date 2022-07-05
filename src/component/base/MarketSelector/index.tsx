import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/base/SmallFormLabel"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import _ from "lodash"
import { PoolSummary } from "../../../constant/types"
import { useMemo } from "react"
import { createPoolSummary } from "../../../util/market"

function MarketSelector() {
    const { marketStates, setCurrentMarket, currentMarket } = PerpdexMarketContainer.useContainer()

    const poolSummary: { [key: string]: PoolSummary } = useMemo(() => {
        return _.mapValues(marketStates, createPoolSummary)
    }, [marketStates])

    const handleOnChange = (ev: React.ChangeEvent<HTMLSelectElement>) =>
        ev.target.value && setCurrentMarket(ev.target.value)

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange}>
                {_.map(marketStates, (marketState, marketAddress) => (
                    <option key={marketAddress} value={marketAddress} selected={marketAddress === currentMarket}>
                        {poolSummary[marketAddress].poolName}
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
