import { PerpdexExchange__factory, PerpdexMarket__factory } from "types/newContracts"
import { Contract as MulticallContract } from "ethers-multicall"
import { abis } from "../../constant/contract"

export const createExchangeContract = (address: string, signer: any) => {
    return PerpdexExchange__factory.connect(address, signer)
}

export const createMarketContract = (address: string, signer: any) => {
    return PerpdexMarket__factory.connect(address, signer)
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

export const createERC4626ContractMulticall = (address: string) => {
    return new MulticallContract(address, abis.IERC4626)
}
