import React, { useEffect, useState } from "react"
import { Slider as ChakuraSlider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb, Box } from "@chakra-ui/react"

interface SliderState {
    currentValue: number
    maxValue?: number
    handleUpdate: (value: number) => void
}

function Slider({ currentValue, maxValue, handleUpdate }: SliderState) {
    const [sliderValue, setSliderValue] = useState<number>(25)

    useEffect(() => {
        if (currentValue) {
            console.log("setvalue", currentValue)
            setSliderValue(currentValue)
        }
    }, [currentValue])

    const handleOnChange = (val: number) => {
        handleUpdate(val)
        setSliderValue(val)
    }

    const labelStyles = {
        mt: "1",
        ml: "-2.5",
        fontSize: "sm",
    }

    const markedValues = [0, maxValue ? maxValue : 10]

    return (
        <Box px={4} pt={4} pb={8} bg="blackAlpha.50" borderRadius="xl">
            <ChakuraSlider
                defaultValue={sliderValue}
                value={sliderValue}
                min={0}
                max={10}
                step={0.01}
                aria-label="slider-ex-6"
                onChange={handleOnChange}
                // colorScheme={side === 1 ? "green" : "red"}
            >
                <SliderTrack>
                    <SliderFilledTrack bg="#F90077" />
                </SliderTrack>
                {markedValues.map(val => (
                    <SliderMark value={val} {...labelStyles}>
                        {val}x
                    </SliderMark>
                ))}
                <SliderMark
                    value={sliderValue}
                    textAlign="center"
                    bg="#181B41"
                    color="white"
                    fontSize="sm"
                    mt="1"
                    ml="-5"
                    w="12"
                >
                    {sliderValue}x
                </SliderMark>
                <SliderThumb />
            </ChakuraSlider>
        </Box>
    )
}

export default Slider
