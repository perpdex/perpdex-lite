import WalletListModal from "component/WalletModal"
import { Route, Switch } from "react-router-dom"
import SideBar from "./component/SideBar"
import Main from "./component/Main"
import Home from "./page/Home"
import "focus-visible/dist/focus-visible"
import { Box, Flex } from "@chakra-ui/react"
import ClosePositionModal from "component/ClosePositionModal"
import AdjustMarginModal from "component/AdjustMarginModal"
import BlockedRegionModal from "component/BlockedRegionModal"
import UserAgreementModal from "component/UserAgreementModal"

export const App = () => (
    <Box width="100%">
        <Flex>
            <SideBar />
            <Main>
                <Switch>
                    <Route path="/">
                        <Home />
                    </Route>
                </Switch>
            </Main>
        </Flex>
        <WalletListModal />
        <ClosePositionModal />
        <AdjustMarginModal />
        <UserAgreementModal />
        {/* NOTE: BlockedRegionModal should be in the last one */}
        <BlockedRegionModal />
    </Box>
)
