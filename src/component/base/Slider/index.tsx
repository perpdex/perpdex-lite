import React, { useState } from "react"
import { Slider as ChakuraSlider, SliderMark, SliderTrack, SliderFilledTrack, SliderThumb, Box } from "@chakra-ui/react"

function Slider() {
    const [sliderValue, setSliderValue] = useState<number>(25)

    const labelStyles = {
        mt: "2",
        ml: "-2.5",
        fontSize: "sm",
    }

    const markedValues = [10, 25, 50, 75, 100]

    return (
        <Box pt={6} pb={2} mx={2}>
            <ChakuraSlider
                defaultValue={sliderValue}
                step={5}
                aria-label="slider-ex-6"
                onChange={val => setSliderValue(val)}
            >
                <SliderTrack bg="red.100">
                    <Box position="relative" right={10} />
                    <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb boxSize={6} />
                {markedValues.map(val => (
                    <SliderMark value={val} {...labelStyles}>
                        {val}%
                    </SliderMark>
                ))}
                <SliderMark value={sliderValue} textAlign="center" bg="blue.500" color="white" mt="-10" ml="-5" w="12">
                    {sliderValue}%
                </SliderMark>
            </ChakuraSlider>
        </Box>
    )
}

export default Slider
