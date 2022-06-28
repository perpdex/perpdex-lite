import WalletListModal from "component/WalletModal"
import { Route, Switch, Router } from "react-router-dom"
import { createBrowserHistory } from "history"
import Header from "./component/Header"
import Home from "./page/Home"
import Trade from "./page/Trade"
import "focus-visible/dist/focus-visible"
import { Container, Divider } from "@chakra-ui/react"
import ClosePositionModal from "component/ClosePositionModal"
import BlockedRegionModal from "component/BlockedRegionModal"
import UserAgreementModal from "component/UserAgreementModal"
import AccountPerpdexModal from "component/AccountModal"
import LiquidityProviderModal from "component/LiquidityProviderModal"
import LiquidityProvider from "page/LiquidityProvider"
import Pools from "page/Pools"

export const App = () => {
    const history = createBrowserHistory()

    return (
        <Container maxW="container.2xl" pb={20} px={6}>
            <Router history={history}>
                <Header />
                <Divider />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/trade" component={Trade} />
                    <Route exact path="/pools" component={Pools} />
                    <Route exact path="/pools/:marketAddress" component={LiquidityProvider} />
                </Switch>
                <LiquidityProviderModal />
                <WalletListModal />
                <ClosePositionModal />
                <UserAgreementModal />
                {/* NOTE: BlockedRegionModal should be in the last one */}
                <BlockedRegionModal />
                <AccountPerpdexModal />
            </Router>
        </Container>
    )
}
