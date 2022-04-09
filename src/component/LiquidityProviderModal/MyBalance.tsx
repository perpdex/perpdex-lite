import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import { supportedChains } from "connector"
import { USDC_DECIMAL_DIGITS } from "constant"
import { Connection } from "container/connection"
import { OldContract } from "container/oldContract"
import { useToken } from "hook/useToken"
import { useCallback } from "react"
import { numberWithCommasUsdc } from "util/format"

interface MyBalanceProps {
    setCollateral: Function
}

function MyBalance({ setCollateral }: MyBalanceProps) {
    const { account } = Connection.useContainer()
    const { addressMap } = OldContract.useContainer()

    /* prepare balance data  */
    const { balance } = useToken(addressMap ? addressMap.XDaiUsdc : "", USDC_DECIMAL_DIGITS, supportedChains.XDai)

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
