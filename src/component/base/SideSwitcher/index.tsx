import React from "react"
import { Wrap, WrapItem, FormControl } from "@chakra-ui/react"
import Button from "../Button"

interface SideSwitcherState {
    isBuy: boolean
    longText: string
    shortText: string
    doSwitchToBuy: (val: boolean) => void
}

function SideSwitcher({ isBuy, longText, shortText, doSwitchToBuy }: SideSwitcherState) {
    return (
        <FormControl id="margin">
            <Wrap justify="space-between">
                <WrapItem w="45%">
                    <Button
                        customType={isBuy ? "base-green" : "outline-green"}
                        onClick={() => doSwitchToBuy(true)}
                        width="100%"
                        text={longText}
                        isFullWidth
                    />
                </WrapItem>
                <WrapItem w="45%">
                    <Button
                        customType={isBuy ? "outline-pink" : "base-pink"}
                        onClick={() => doSwitchToBuy(false)}
                        width="100%"
                        text={shortText}
                        isFullWidth
                    />
                </WrapItem>
            </Wrap>
        </FormControl>
    )
}

export default SideSwitcher
