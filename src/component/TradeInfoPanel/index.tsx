import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { AccountInfo } from "../../constant/types"
import { numberWithCommas } from "../../util/format"
import Big from "big.js"

interface Props {
    myAccountInfo: AccountInfo
}

function TradeInfoPanel(props: Props) {
    const { myAccountInfo } = props

    const mmRatio = myAccountInfo?.mmRatio || Big(0)
    const leverage = mmRatio.eq(0) ? Big(0) : Big(1).div(mmRatio)

    return (
        <>
            <HStack w="100%" justifyContent="space-evenly" mt={10}>
                <Box w={44} h={40} borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>Margin Ratio</Text>
                        <Text>{numberWithCommas(mmRatio.mul(100), 2)}%</Text>
                    </Flex>
                </Box>
                <Box w={44} h={40} background="#31396C" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>Leverage</Text>
                        <Text>{numberWithCommas(leverage, 2)}x</Text>
                    </Flex>
                </Box>
            </HStack>
            <HStack w="100%" justifyContent="space-evenly">
                <Box w={44} h={40} background="#31396C" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>-</Text>
                        <Text>-</Text>
                    </Flex>
                </Box>
                <Box w={44} h={40} borderColor="#728BEC" borderWidth="1px" borderRadius="10px" p={6}>
                    <Flex h="100%" flexDirection="column" justifyContent="space-around" alignItems="center">
                        <Text>-</Text>
                        <Text>-</Text>
                    </Flex>
                </Box>
            </HStack>
        </>
    )
}

export default TradeInfoPanel
