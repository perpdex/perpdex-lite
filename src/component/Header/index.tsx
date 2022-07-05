import React from "react"
import { Link } from "react-router-dom"
import { Flex, Spacer, Button, HStack, Center, Heading } from "@chakra-ui/react"
import { Logo } from "../Icon"
import ConnectBtn from "./ConnectBtn"

function Header() {
    return (
        <Flex minWidth="max-content" h="90px" alignItems="center">
            <Center marginLeft="24px">
                <Link to="/">
                    <Logo></Logo>
                </Link>
            </Center>
            <Center marginLeft="18px">
                <Link to="/">
                    <Heading size="md">PerpDEX</Heading>
                </Link>
            </Center>
            <Spacer />
            <Center>
                <HStack spacing={["24px", "30px", "42px", "80px"]}>
                    <Link to="/">
                        <Button variant="link">Home</Button>
                    </Link>
                    <Link to="/trade">
                        <Button variant="link">Trade</Button>
                    </Link>
                    <Link to="/pools">
                        <Button variant="link">Pool</Button>
                    </Link>
                    <Link to="/tokens">
                        <Button variant="link">Position Tokens</Button>
                    </Link>
                    {/*TODO: implement history*/}
                    {/*<Link to="/history">*/}
                    {/*    <Button variant="link">History</Button>*/}
                    {/*</Link>*/}
                </HStack>
            </Center>
            <Spacer />
            <ConnectBtn />
        </Flex>
    )
}

export default Header
