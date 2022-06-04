import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import { Connection } from "container/connection"
import { Contract } from "container/contract"
import { useToken } from "hook/useToken"
import { useCallback } from "react"
import { numberWithCommasUsdc } from "util/format"
import { bigNum2Big } from "../../../../util/format"

interface MyBalanceProps {
    setCollateral: Function
}

function MyBalance({ setCollateral }: MyBalanceProps) {
    const { account, chainId } = Connection.useContainer()
    const { ercTokenAddress } = Contract.useContainer()

    /* prepare balance data  */
    const { balance } = useToken(ercTokenAddress.baseTokens.usd, chainId ? chainId : 4) // TODO: chainId

    const handleOnClick = useCallback(() => {
        /* make sure the precision will be controlled */
        const fixedBalance = balance.toNumber()
        setCollateral(fixedBalance)
    }, [balance, setCollateral])

    return (
        <FormHelperText>
            <HStack w="100%" justifyContent="space-between" alignItems="flex-start">
                <Box>My Balance : {account ? numberWithCommasUsdc(bigNum2Big(balance)) : "null"}</Box>
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
