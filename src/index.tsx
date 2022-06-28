import * as React from "react"
import * as serviceWorker from "./serviceWorker"

import { createErrorBoundary, setupBugsnag } from "./lib/bugsnag"

import { App } from "./App"
import { ChakraProvider } from "@chakra-ui/react"
import { PerpdexExchangeContainer } from "container/connection/perpdexExchangeContainer"
import { PerpdexMarketContainer } from "container/connection/perpdexMarketContainer"
import { Connection } from "./container/connection"
import { Reload } from "./container/connection/reload"
import { Fonts } from "component/Font"
import { Modal } from "container/modal"
import { Position } from "container/perpetual/position"
import ReactDOM from "react-dom"
import { Trade } from "container/perpetual/trade"
import { Transaction } from "./container/connection/transaction"
import { User } from "./container/connection/user"
import { Web3Provider } from "./util/web3"
import { AccountPerpdex } from "./container/perpetual/account"
import reportWebVitals from "./reportWebVitals"
import { setupSegment } from "./lib/segment"
import theme from "./theme"

declare global {
    interface Window {
        ethereum: any
    }
}

// NOTE: third party services
setupSegment()
setupBugsnag()
const ErrorBoundary = createErrorBoundary()

const Providers = ((...providers: any[]) => ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight((providers, provider) => {
        const Provider = provider.component || provider
        const props = provider.props || {}
        return <Provider {...props}>{providers}</Provider>
    }, children)
})(
    { component: ChakraProvider, props: { theme } },
    Web3Provider,
    Connection.Provider,
    Reload.Provider,
    User.Provider,
    Transaction.Provider,
    PerpdexMarketContainer.Provider,
    PerpdexExchangeContainer.Provider,
    AccountPerpdex.Provider,
    Trade.Provider,
    Position.Provider,
    Modal.Provider,
)

ReactDOM.render(
    <React.StrictMode>
        <ErrorBoundary>
            <Providers>
                <Fonts />
                <App />
            </Providers>
        </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById("root"),
)

/* NOTE:
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://cra.link/PWA
 **/
serviceWorker.unregister()

/* NOTE:
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 **/
reportWebVitals()
