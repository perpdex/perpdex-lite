import React from "react"
import { VStack, Stack, Button, Flex, Box, Spacer } from "@chakra-ui/react"

import ConnectBtn from "./ConnectBtn"

function SideBar() {
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
            <VStack p="2">
                <div id="router-handler">Trade, Pools</div>
                <div id="market-pairs">Market Pairs</div>
            </VStack>
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
