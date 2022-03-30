import React from "react"
import { VStack, Stack, Button, Flex, Box, Spacer, ButtonGroup, LinkBox } from "@chakra-ui/react"

import ConnectBtn from "./ConnectBtn"

function SideBar() {
    const pairs = [
        {
            name: "BTC",
        },
        {
            name: "ETH",
        },
    ]

    return (
        <VStack width={280}>
            <Stack width="100%" p="2">
                <Flex>
                    <Box>
                        <div>perpdex svg</div>
                    </Box>
                    <Spacer />
                    <Box>
                        <ConnectBtn />
                    </Box>
                </Flex>
            </Stack>
            <Box width="100%" p="2">
                <Button width="100%">Wecome</Button>
            </Box>
            <Box>
                <VStack width="100%">
                    <ButtonGroup width="100%" p="0">
                        <Button width="100%">svg Trade</Button>
                        <Button width="100%">svg Pools</Button>
                    </ButtonGroup>
                    <VStack p="2">
                        {pairs.map(pair => (
                            <LinkBox>{pair.name}</LinkBox>
                        ))}
                    </VStack>
                </VStack>
            </Box>
            <Box width="100%" p="2">
                <Button width="100%">History</Button>
            </Box>
            <Box width="100%" p="2">
                <Button width="100%">Rewards</Button>
            </Box>
        </VStack>
    )
}

export default SideBar
