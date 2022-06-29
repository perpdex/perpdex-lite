import { HStack, Heading, Stack, Text } from "@chakra-ui/react"
import { ExternalLink } from "component/ExternalLink"
import { ExternalLinkIcon } from "@chakra-ui/icons"

import FrameContainer from "component/FrameContainer"
import AssetInfo from "./AssetInfo"
import AccountPanel from "../../component/AccountPanel"

function Home() {
    return (
        <FrameContainer>
            <AssetInfo />
            <AccountPanel></AccountPanel>
        </FrameContainer>
    )
}

export default Home
