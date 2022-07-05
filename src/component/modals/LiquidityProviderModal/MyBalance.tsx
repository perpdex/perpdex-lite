import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
// import { supportedChains } from "connector"
import { Connection } from "container/connection"
// import { Contract } from "container/contract"
// import { useToken } from "hook/useToken"
import { useCallback } from "react"

interface MyBalanceProps {
    setCollateral: Function
}

function MyBalance({ setCollateral }: MyBalanceProps) {
    const { account } = Connection.useContainer()
    // const { ercTokenAddress } = Contract.useContainer()

    /**
     * TODO:
     * - support other chains
     * - support combination of quoteToken and baseToken
     * */
    // const { balance } = useToken(ercTokenAddress.settlementToken, supportedChains.Rinkeby)

    const handleOnClick = useCallback(() => {
        console.log("FIX")
    }, [])

    return (
        <FormHelperText>
            <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                <Box>My Balance : {account && "null"}</Box>
                {account && (
                    <Button borderRadius="xl" size="xs" variant="outline" onClick={handleOnClick}>
                        MAX
                    </Button>
                )}
            </HStack>
        </FormHelperText>
    )
}

export default MyBalance
