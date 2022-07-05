// import { gql } from "graphql-tag"

export const liquidityAddedExchanges = `
query {
  liquidityAddedExchanges(first: 100) {
    nodes {
      id
      exchange
      trader
      market
      base
      quote
      liquidity
      cumBasePerLiquidityX96
      cumQuotePerLiquidityX96
      baseBalancePerShareX96
      sharePriceAfterX96
      blockNumberLogIndex
      timestamp
    }
  }
}
`

export const liquidityRemovedExchanges = `
query {
  liquidityRemovedExchanges(first: 100) {
    nodes {
      id
      exchange
      trader
      market
      liquidator
      base
      quote
      liquidity
      takerBase
      takerQuote
      realizedPnl
      baseBalancePerShareX96
      sharePriceAfterX96
      blockNumberLogIndex
      timestamp
    }
  }
}
`

export const liquidityAddedMarkets = `
  query {
    liquidityAddedMarkets(first: 100) {
      nodes {
        id
        market
        base
        quote
        liquidity
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const liquidityRemovedMarkets = `
  query {
    liquidityAddedMarkets(first: 100) {
      nodes {
        id
        market
        base
        quote
        liquidity
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const liquidityHistories = `
  query {
    liquidityHistories(first: 100) {
      nodes {
        id
        trader
        market
        histories {
          edges {
            node {
              id
              trader
              market
              time
              base
              quote
              liquidity
              liquidityHistory {
                id
              }
            }
          }
        }
        timestamp
      }
    }
  }
`
