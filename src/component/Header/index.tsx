import { Flex, Heading, Spacer, Box, Button, HStack, Center } from "@chakra-ui/react"

import ConnectBtn from "./ConnectBtn"
import { Link } from "react-router-dom"
import React from "react"

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
                <HStack spacing="24px">
                    <Link to="/">
                        <Button colorScheme="teal" variant="link">
                            Home
                        </Button>
                    </Link>
                    <Link to="/trade">
                        <Button colorScheme="teal" variant="link">
                            Trade
                        </Button>
                    </Link>
                    <Link to="/pool">
                        <Button colorScheme="teal" variant="link">
                            Pool
                        </Button>
                    </Link>
                    <Link to="/tokens">
                        <Button colorScheme="teal" variant="link">
                            Position Tokens
                        </Button>
                    </Link>
                    <Link to="/history">
                        <Button colorScheme="teal" variant="link">
                            History
                        </Button>
                    </Link>
                </HStack>
            </Center>
            <Spacer />
            <ConnectBtn />
        </Flex>
    )
}

export default Header
