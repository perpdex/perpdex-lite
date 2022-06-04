import WalletListModal from "component/WalletModal"
import { Route, Switch } from "react-router-dom"
import Header from "./component/Header"
import Home from "./page/Home"
import Trade from "./page/Trade"
import "focus-visible/dist/focus-visible"
import { Container, Divider } from "@chakra-ui/react"
import ClosePositionModal from "component/ClosePositionModal"
import BlockedRegionModal from "component/BlockedRegionModal"
import UserAgreementModal from "component/UserAgreementModal"
import AccountPerpdexModal from "component/AccountPerpdexModal"
import LiquidityProviderModal from "component/LiquidityProviderModal"

export const App = () => (
    <Container maxW="container.lg" pb={20} px={6}>
        <Header />
        <Divider />
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/trade" component={Trade} />
            {/* <Route exact path="/pool" component={Pool} /> */}
        </Switch>
        <LiquidityProviderModal />
        <WalletListModal />
        <ClosePositionModal />
        <UserAgreementModal />
        {/* NOTE: BlockedRegionModal should be in the last one */}
        <BlockedRegionModal />
        <AccountPerpdexModal />
    </Container>
)
