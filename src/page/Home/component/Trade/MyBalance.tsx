import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import { Connection } from "container/connection"
import { NewContract } from "container/newContract"
import { useToken } from "hook/useToken"
import { useCallback } from "react"
import { numberWithCommasUsdc } from "util/format"

interface MyBalanceProps {
    setCollateral: Function
}

function MyBalance({ setCollateral }: MyBalanceProps) {
    const { account, chainId } = Connection.useContainer()
    const { addressMap } = NewContract.useContainer()

    /* prepare balance data  */
    const { balance } = useToken(addressMap ? addressMap.erc20.usdc : "", chainId ? chainId : 1)

    const handleOnClick = useCallback(() => {
        /* make sure the precision will be controlled */
        const fixedBalance = balance.toFixed(2)
        setCollateral(fixedBalance)
    }, [balance, setCollateral])

    return (
        <FormHelperText>
            <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                <Box>My Balance : {account ? numberWithCommasUsdc(balance) : "null"}</Box>
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
