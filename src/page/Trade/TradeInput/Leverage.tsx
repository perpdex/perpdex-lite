import {
    Box,
    FormControl,
    FormLabel,
    Slider,
    SliderFilledTrack,
    SliderMark,
    SliderThumb,
    SliderTrack,
    Text,
    ButtonGroup,
    Button,
} from "@chakra-ui/react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Trade } from "container/perpetual/trade"
import { useDebounce } from "hook/useDebounce"

function Leverage() {
    const { side, leverage, setLeverage } = Trade.useContainer()
    const [_leverage, _setLeverage] = useState<number>(1)
    const debouncedLeverage = useDebounce({ value: _leverage, delay: 500 })

    const handleOnChange = useCallback(
        (value: number) => {
            if (value !== _leverage) {
                _setLeverage(value)
            }
        },
        [_leverage],
    )

    useEffect(() => {
        if (debouncedLeverage !== leverage) {
            setLeverage(debouncedLeverage)
        }
    }, [debouncedLeverage, leverage, setLeverage])

    return useMemo(
        () => (
            <FormControl id="leverages">
                <FormLabel>
                    <Text fontSize="md" color="white">
                        Leverage
                    </Text>
                </FormLabel>
                <Box px={10} pt={4} pb={8} bg="blackAlpha.50" borderRadius="xl">
                    <Slider
                        onChange={handleOnChange}
                        defaultValue={_leverage}
                        value={_leverage}
                        min={1}
                        max={10}
                        step={0.01}
                        colorScheme={side === 1 ? "green" : "red"}
                    >
                        <SliderMark value={1} mt="1" ml="-2.5" fontSize="sm">
                            1x
                        </SliderMark>
                        <SliderMark value={10} mt="1" ml="-2.5" fontSize="sm">
                            10x
                        </SliderMark>
                        <SliderMark
                            value={_leverage}
                            textAlign="center"
                            bg="#181B41"
                            color="white"
                            fontSize="sm"
                            mt="1"
                            ml="-5"
                            w="12"
                        >
                            {_leverage}x
                        </SliderMark>
                        <SliderTrack>
                            <SliderFilledTrack bg="#F90077" />
                        </SliderTrack>
                        <SliderThumb />
                    </Slider>
                </Box>
                <ButtonGroup w="100%" justifyContent={"space-between"}>
                    <Button
                        size="xs"
                        color="white"
                        bgColor="#353E80"
                        borderRadius="10px"
                        onClick={() => {
                            _setLeverage(5)
                        }}
                    >
                        5.0x
                    </Button>
                    <ButtonGroup>
                        <Button
                            size="xs"
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                _setLeverage(2)
                            }}
                        >
                            2.0x
                        </Button>
                        <Button
                            size="xs"
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                _setLeverage(3)
                            }}
                        >
                            3.0x
                        </Button>
                        <Button
                            size="xs"
                            color="white"
                            border="1px"
                            borderColor={"#353E80"}
                            borderRadius="10px"
                            variant="solid"
                            onClick={() => {
                                _setLeverage(10)
                            }}
                        >
                            Max
                        </Button>
                    </ButtonGroup>
                </ButtonGroup>
            </FormControl>
        ),
        [handleOnChange, _leverage, side],
    )
}

export default Leverage
