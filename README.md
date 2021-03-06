## PerpDEX UI

<img width="256px" style="margin: 0 auto; float: right" src="https://fascinating-daffodil-abb5d2.netlify.app/images/perpdex_logo.png" />

This is a UI of PerpDEX protocol with essential features. Note that you need to manually switch to rinkeby network to trade.

-   👉🏻 [Official Site](https://perpdex.com)
-   👉🏻 [Discord] (https://discord.gg/x4cnMGUfyg)

### How to start?

-   set up `.env.local` file ([See the Environment Variables Section](#environment-variables))
-   run `yarn`
-   run `yarn generate-type`
-   run `yarn start`

### Environment Variables

check `.env.local.example`.

#### Required

```sh
REACT_APP_STAGE= /* "production" or "staging" */
REACT_APP_MAINNET_RPC_URL= /* mainnet rpc url */
REACT_APP_RINKEBY_RPC_URL= /* rinkeby rpc url */
```

#### Optional

```sh
REACT_APP_BUGSNAG_API_KEY= /* bugsnag api key */
REACT_APP_SEGMENT_API_KEY= /* segment api key */
```

### Deploy to IPFS
-   run `yarn`
-   run `yarn generate-type`
-   run `yarn build`
-   run `yarn deploy-ipfs`
    - Note: Using `ipfs-deploy@v8.0.1` because newer version needs node v14

## Contribution

Please see [CONTRIBUTING.md](CONTRIBUTING.md)
