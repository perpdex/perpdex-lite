import { Connection } from "container/connection"
import { useMemo } from "react"
import { PerpdexExchange__factory as PerpdexExchangeFactory, PerpdexExchange } from "types/newContracts"
import { createContainer } from "unstated-next"
import { useWeb3React } from "@web3-react/core"
import { contractConfigs } from "../../constant/contract"

export const Contract = createContainer(useContract)

interface ContractState {
    perpdexExchange?: PerpdexExchange
}

const defaultContractInstance: ContractState = {
    perpdexExchange: undefined,
}

function useContract() {
    const { baseNetworkProvider } = Connection.useContainer()
    const { chainId } = useWeb3React()

    return useMemo(() => {
        if (!chainId || !baseNetworkProvider) return defaultContractInstance

        const contractConfig = contractConfigs[chainId]
        if (!contractConfig) return defaultContractInstance

        const exchange = contractConfig.exchanges[0]

        return {
            perpdexExchange: PerpdexExchangeFactory.connect(exchange.address, baseNetworkProvider),
        }
    }, [chainId, baseNetworkProvider])
}
