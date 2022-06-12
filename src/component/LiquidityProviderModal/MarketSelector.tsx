import { FormControl, Select } from "@chakra-ui/react"
import SmallFormLabel from "component/SmallFormLabel"
// import React, { useCallback, useEffect, useMemo } from "react"
import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import { baseSymbolList, BaseSymbolType } from "constant/market"

function MarketSelector() {
    const {
        state: { currentMarketInfo },
    } = PerpdexMarketContainer.useContainer()

    const handleOnChange = () => console.log("FIX")

    return (
        <FormControl id="market">
            <SmallFormLabel>Market</SmallFormLabel>
            <Select onChange={handleOnChange} isDisabled={!currentMarketInfo}>
                {baseSymbolList.map((base: BaseSymbolType, index) => (
                    <option key={`${base}-${currentMarketInfo?.quoteAssetSymbol}`} value={index}>
                        {base} / ${currentMarketInfo?.quoteAssetSymbol} (inverse)
                    </option>
                ))}
            </Select>
        </FormControl>
    )
}

export default MarketSelector
