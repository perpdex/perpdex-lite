import React from "react"
import { Link } from "react-router-dom"
import { Flex, Heading, Spacer, Box, Button, HStack, Center } from "@chakra-ui/react"

import ConnectBtn from "./ConnectBtn"

function Header() {
    return (
        <Flex minWidth="max-content" h="64px" alignItems="center">
            <Box p="2">
                <Link to="/">
                    <Heading size="md">PerpDEX</Heading>
                </Link>
            </Box>
            <Spacer />
            <Center>
                <HStack spacing={["24px", "30px", "42px", "80px"]}>
                    <Link to="/">
                        <Button variant="link">Home</Button>
                    </Link>
                    <Link to="/trade">
                        <Button variant="link">Trade</Button>
                    </Link>
                    <Link to="/pool">
                        <Button variant="link">Pool</Button>
                    </Link>
                    <Link to="/tokens">
                        <Button variant="link">Position Tokens</Button>
                    </Link>
                    <Link to="/history">
                        <Button variant="link">History</Button>
                    </Link>
                </HStack>
            </Center>
            <Spacer />
            <ConnectBtn />
        </Flex>
    )
}

export default Header
