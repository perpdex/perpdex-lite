import { Box, Heading, Text, VStack } from "@chakra-ui/react"
import SendTxButton from "./SendTxButton"
import TxInfoTable from "./TxInfoTable"

function Summary() {
    return (
        <>
            <Heading w="full" size="md">
                Transaction Summary
            </Heading>
            <Box width="100%" borderStyle="solid" borderWidth="1px" borderColor="gray.200" borderRadius="12px" mb="4">
                <TxInfoTable />
            </Box>
            <VStack spacing={2} width="full">
                <SendTxButton />
                <Text fontSize="sm" color="gray.500">
                    Confirm in Metamask
                </Text>
            </VStack>
        </>
    )
}

export default Summary
