import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
// import React, { useCallback, useEffect, useMemo } from "react"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { baseSymbolList, BaseSymbolType } from "constant/market"

function MarketSelector() {
    const { currentState } = PerpdexMarketContainer.useContainer()

    const handleOnChange = () => console.log("FIX")

    // TODO: replace baseSymbolList

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange} isDisabled={!currentState}>
                {currentState &&
                    baseSymbolList.map((baseSymbol: BaseSymbolType, index) => (
                        <option key={`${currentState?.quoteSymbol}-${baseSymbol}`} value={index}>
                            {currentState?.quoteSymbol} / {baseSymbol} (inverse)
                        </option>
                    ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
