import { DebugPerpdexExchange__factory, PerpdexMarket__factory, PerpdexLongToken__factory } from "types/newContracts"
import { Contract as MulticallContract } from "ethers-multicall"
import { abis } from "../../constant/contract"

export const createExchangeContract = (address: string, signer: any) => {
    return DebugPerpdexExchange__factory.connect(address, signer)
}

export const createMarketContract = (address: string, signer: any) => {
    return PerpdexMarket__factory.connect(address, signer)
}

export const createLongTokenContract = (address: string, signer: any) => {
    return PerpdexLongToken__factory.connect(address, signer)
}

export const createExchangeContractMulticall = (address: string) => {
    return new MulticallContract(address, abis.PerpdexExchange)
}

export const createMarketContractMulticall = (address: string) => {
    return new MulticallContract(address, abis.PerpdexMarket)
}

export const createPriceFeedContractMulticall = (address: string) => {
    return new MulticallContract(address, abis.IPerpdexPriceFeed)
}

export const createERC20ContractMulticall = (address: string) => {
    return new MulticallContract(address, abis.IERC20Metadata)
}

export const createLongTokenContractMulticall = (address: string) => {
    return new MulticallContract(address, abis.PerpdexLongToken)
}
