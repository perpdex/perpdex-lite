import { Box, Button, FormHelperText, HStack } from "@chakra-ui/react"
import { BigNumber } from "ethers"
import { useCallback } from "react"
import { numberWithCommasUsdc } from "util/format"
import { bigNum2Big } from "../../util/format"

interface MyBalanceProps {
    account: string
    balance: BigNumber
    setCollateral: Function
}

function MyBalance({ account, balance, setCollateral }: MyBalanceProps) {
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
