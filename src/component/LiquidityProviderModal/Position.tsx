import { FormControl, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react"

import { PerpdexMarketContainer } from "container/perpdexMarketContainer"
import SmallFormLabel from "component/SmallFormLabel"
import { usePositionSize } from "./usePositionSize"

function Position() {
    const {
        state: { currentMarketInfo },
    } = PerpdexMarketContainer.useContainer()
    const { positionSize, isCalculating } = usePositionSize()

    return (
        <FormControl id="position">
            <SmallFormLabel>Position</SmallFormLabel>
            <InputGroup>
                <Input variant="filled" isReadOnly value={isCalculating ? "⃜⏳" : positionSize} />
                <InputRightElement w="54px">
                    <Text
                        w="100%"
                        textAlign="center"
                        fontWeight="bold"
                        fontSize="xs"
                        color="gray.500"
                        textTransform="uppercase"
                    >
                        {currentMarketInfo?.baseAssetSymbol}
                    </Text>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    )
}

export default Position
