import React from "react"
import { Wrap, WrapItem, FormControl } from "@chakra-ui/react"
import Button from "../Button"

interface SideSwitcherState {
    isBuy: boolean
    doSwitchToBuy: (val: boolean) => void
}

function SideSwitcher({ isBuy, doSwitchToBuy }: SideSwitcherState) {
    return (
        <FormControl id="margin">
            <Wrap justify="space-between">
                <WrapItem w="45%">
                    <Button
                        customType={isBuy ? "base-green" : "outline-green"}
                        onClick={() => doSwitchToBuy(true)}
                        width="100%"
                        text="Buy/Long"
                        isFullWidth
                    />
                </WrapItem>
                <WrapItem w="45%">
                    <Button
                        customType={isBuy ? "outline-pink" : "base-pink"}
                        onClick={() => doSwitchToBuy(false)}
                        width="100%"
                        text="Sell/Short"
                        isFullWidth
                    />
                </WrapItem>
            </Wrap>
        </FormControl>
    )
}

export default SideSwitcher
