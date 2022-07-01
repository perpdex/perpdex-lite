import { HStack, StackDivider, VStack } from "@chakra-ui/react"

import FrameContainer from "component/FrameContainer"
import AccountPanel from "../../component/AccountPanel"
import AccountInfoTable from "component/AccountInfoTable"
import TradeInfoPanel from "component/TradeInfoPanel"
import OpenPositionsTable from "component/OpenPositionsTable"

function Home() {
    return (
        <FrameContainer>
            <HStack justifyContent="space-evenly" divider={<StackDivider borderColor="#627EEA" />} spacing={10}>
                <VStack>
                    <AccountPanel />
                    <AccountInfoTable />
                </VStack>
                <VStack spacing={10}>
                    <TradeInfoPanel />
                    <OpenPositionsTable />
                </VStack>
            </HStack>
            {/* <AssetInfo /> */}
        </FrameContainer>
    )
}

export default Home
