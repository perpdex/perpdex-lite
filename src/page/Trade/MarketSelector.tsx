import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
// import React, { useCallback, useEffect, useMemo } from "react"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { baseSymbolList, BaseSymbolType } from "constant/market"

function MarketSelector() {
    const {
        state: { currentMarket },
    } = PerpdexMarketContainer.useContainer()

    const handleOnChange = () => console.log("FIX")

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange} isDisabled={!currentMarket}>
                {currentMarket &&
                    baseSymbolList.map((baseSymbol: BaseSymbolType, index) => (
                        <option key={`${currentMarket?.quoteAssetSymbol}-${baseSymbol}`} value={index}>
                            {currentMarket?.quoteAssetSymbol} / {baseSymbol} (inverse)
                        </option>
                    ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
