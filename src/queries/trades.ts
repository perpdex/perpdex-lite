import { gql } from "@apollo/client"

export const getMarketCandlesQuery = gql`
    query($market: String!) {
        candles(first: 100, filter: { market: { equalTo: $market } }) {
            nodes {
                id
                market
                timeFormat
                time
                openX96
                highX96
                lowX96
                closeX96
                baseAmount
                quoteAmount
                timestamp
            }
        }
    }
`

export const candles = `
  query {
    candles(first: 100) {
      nodes {
        id
        market
        timeFormat
        time
        openX96
        highX96
        lowX96
        closeX96
        baseAmount
        quoteAmount
        timestamp
      }
    }
  }
`

export const daySummaries = `
  query {
    daySummaries(first: 100) {
      nodes {
        id
        trader
        dayID
        time
        realizedPnl
        timestamp
      }
    }
  }
`

export const getPositionChangedsQuery = gql`
    query($market: String!) {
        positionChangeds(first: 100, filter: { market: { equalTo: $market } }) {
            nodes {
                id
                exchange
                trader
                market
                base
                quote
                realizedPnl
                protocolFee
                baseBalancePerShareX96
                sharePriceAfterX96
                liquidator
                liquidationPenalty
                liquidationReward
                insuranceFundReward
                blockNumberLogIndex
                timestamp
            }
        }
    }
`

export const positionChangeds = `
  query {
    positionChangeds(first: 100) {
      nodes {
        id
        exchange
        trader
        market
        base
        quote
        realizedPnl
        protocolFee
        baseBalancePerShareX96
        sharePriceAfterX96
        liquidator
        liquidationPenalty
        liquidationReward
        insuranceFundReward
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const fundingPaids = `
  query {
    fundingPaids(first: 100) {
      nodes {
        id
        market
        fundingRateX96
        elapsedSec
        premiumX96
        markPriceX96
        cumBasePerLiquidityX96
        cumQuotePerLiquidityX96
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const swappeds = `
  query {
    swappeds(first: 100) {
      nodes {
        id
        market
        isBaseToQuote
        isExactInput
        amount
        oppositeAmount
        blockNumberLogIndex
        timestamp
      }
    }
  }
`

export const positionHistories = `
  query {
    positionHistories(first: 100) {
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
              realizedPnl
              protocolFee
              timestamp
            }
          }
        }
        timestamp
      }
    }
  }
`

export const openOrders = `
  query {
    openOrders(first: 100) {
      nodes {
        id

        maker
        market
        base
        quote
        liquidity
        realizedPnl
        timestamp
      }
    }
  }
`
