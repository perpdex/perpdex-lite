import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
// import React, { useCallback, useEffect, useMemo } from "react"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { baseSymbolList, BaseSymbolType } from "constant/market"

function MarketSelector() {
    const { currentState } = PerpdexMarketContainer.useContainer()

    const handleOnChange = () => console.log("FIX")

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange} isDisabled={!currentState}>
                {baseSymbolList.map((base: BaseSymbolType, index) => (
                    <option key={`${base}-${currentState?.quoteSymbol}`} value={index}>
                        {base} / ${currentState?.quoteSymbol} (inverse)
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
