import { Web3Provider } from "@ethersproject/providers"

export const getBlance = async (provider: Web3Provider, address: string) => {
    const balanceWei = await provider.getBalance(address)
    return balanceWei
}
