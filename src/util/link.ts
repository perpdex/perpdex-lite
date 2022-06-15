import { networkConfigs } from "../constant/network"

export function getEtherscanTxLink(chainId?: number, txId: string = "") {
    return `${networkConfigs[chainId || ""].etherscanUrl}/tx/${txId}`
}
