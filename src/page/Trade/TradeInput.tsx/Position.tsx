import { FormControl, Input, InputGroup, InputRightElement, Text } from "@chakra-ui/react"

import SmallFormLabel from "component/SmallFormLabel"

interface PositionState {
    positionSymbol: string
    positionSize: string
}

function Position({ positionSymbol, positionSize }: PositionState) {
    return (
        <FormControl id="position">
            <SmallFormLabel>Position</SmallFormLabel>
            <InputGroup>
                <Input variant="filled" isReadOnly value={positionSize} />
                <InputRightElement w="54px">
                    <Text
                        w="100%"
                        textAlign="center"
                        fontWeight="bold"
                        fontSize="xs"
                        color="gray.500"
                        textTransform="uppercase"
                    >
                        {positionSymbol}
                    </Text>
                </InputRightElement>
            </InputGroup>
        </FormControl>
    )
}

export default Position
