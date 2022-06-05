import { HStack, Heading, Stack, Text } from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import { ExternalLinkIcon } from "@chakra-ui/icons"

import FrameContainer from "component/FrameContainer"

function Home() {
    return (
        <FrameContainer>
            <Stack spacing={10}>
                <Stack spacing={5}>
                    <Heading size="md">About</Heading>
                    <Text>
                        This is a{" "}
                        <ExternalLink color="blue.500" href="https://perpdex.com" isExternal>
                            PerpDEX Protocol <ExternalLinkIcon mx="2px" />
                        </ExternalLink>{" "}
                        UI with essential features. Note that you need to manually switch to{" "}
                        <strong>rinkeby network</strong> to trade.
                    </Text>
                    <HStack>
                        <ExternalLink color="blue.500" href="https://github.com/perpdex/perpdex-lite" isExternal>
                            Github <ExternalLinkIcon mx="2px" />
                        </ExternalLink>{" "}
                        <ExternalLink color="blue.500" href="https://discord.gg/x4cnMGUfyg" isExternal>
                            Discord <ExternalLinkIcon mx="2px" />
                        </ExternalLink>
                    </HStack>
                </Stack>
                {/*<Divider />*/}
                {/*<Stack spacing={5}>*/}
                {/*    <Heading size="md">Switch Network</Heading>*/}
                {/*    <Text>*/}
                {/*        You're currently on <strong>Ethereum Mainnet</strong>{" "}*/}
                {/*    </Text>*/}
                {/*    <Button isFullWidth isDisabled colorScheme="blue">*/}
                {/*        Add / Switch to xDai Network*/}
                {/*    </Button>*/}
                {/*    <Text fontSize="sm" color="gray.500">*/}
                {/*        This feature is not available for now.*/}
                {/*    </Text>*/}
                {/*</Stack>*/}
            </Stack>
        </FrameContainer>
    )
}

export default Home
