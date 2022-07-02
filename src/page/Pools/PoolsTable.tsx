import { Table, Thead, Tbody, Tr, Th, Td, Button, chakra, Text, HStack, VStack } from "@chakra-ui/react"
import { MarketState } from "../../constant/types"
import { CurrencyIcon } from "../../component/Icon"

export type PoolsTableUnit = MarketState

export interface PoolsTableState {
    data: PoolsTableUnit[]
    handleOnClick: (address: string) => void
}

const StyledTh = chakra(Th, {
    baseStyle: {
        color: "#FFFFFF",
        borderBottom: { base: "0px none", md: "1px solid #627EEA" },
        fontSize: "lg",
    },
})

const StyledText = chakra(Text, {
    baseStyle: {
        marginTop: "0px !important",
    },
})

function PoolsTable({ data, handleOnClick }: PoolsTableState) {
    return (
        <Table variant="simple">
            <Thead height={68}>
                <Tr>
                    <StyledTh>Pool Name</StyledTh>
                    <StyledTh>Perpetual Contracts</StyledTh>
                    <StyledTh>Liquidity</StyledTh>
                    <StyledTh></StyledTh>
                </Tr>
            </Thead>
            <Tbody>
                {[
                    <Tr>
                        <Td borderBottom={0}>
                            <HStack>
                                <CurrencyIcon symbol={"ETH"} boxSize={8} />
                                <Text>ETH Pool</Text>
                            </HStack>
                        </Td>
                        <Td borderBottom={0}>
                            <HStack>
                                <CurrencyIcon symbol={"USD"} boxSize={8} />
                                <Text>USD-ETH</Text>
                            </HStack>
                        </Td>
                        <Td borderBottom={0}>
                            <HStack>
                                <CurrencyIcon symbol={"ETH"} boxSize={8} />
                                <VStack>
                                    <Text>30.42 ETH</Text>
                                    <StyledText fontSize="sm" color="gray.400">
                                        $30,457.43
                                    </StyledText>
                                </VStack>
                            </HStack>
                        </Td>
                        <Td borderBottom={0}>
                            <Button bgColor="#353E80" borderRadius="10px" color="white">
                                Add Liquidity
                            </Button>
                        </Td>
                    </Tr>,
                    <Tr _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}>
                        <Td borderBottom={0}></Td>
                        <Td borderBottom={0}>
                            <HStack>
                                <CurrencyIcon symbol={"BTC"} boxSize={8} />
                                <Text>BTC-ETH</Text>
                            </HStack>
                        </Td>
                        <Td borderBottom={0}></Td>
                        <Td borderBottom={0}></Td>
                    </Tr>,
                ]}
                <Tr>
                    <Td borderBottom={0} valign="top">
                        <HStack>
                            <CurrencyIcon symbol={"USD"} boxSize={8} />
                            <Text>BUSD Pool</Text>
                        </HStack>
                    </Td>
                    <Td borderBottom={0}>
                        <VStack alignItems="flex-start">
                            <HStack>
                                <CurrencyIcon symbol={"BTC"} boxSize={8} />
                                <Text>BTC-BUSD</Text>
                            </HStack>
                            <HStack>
                                <CurrencyIcon symbol={"ETH"} boxSize={8} />
                                <Text>ETH-BUSD</Text>
                            </HStack>
                            <HStack>
                                <CurrencyIcon symbol={"USD"} boxSize={8} />
                                <Text>USD-BUSD</Text>
                            </HStack>
                        </VStack>
                    </Td>
                    <Td borderBottom={0} valign="top">
                        <HStack>
                            <CurrencyIcon symbol={"ETH"} boxSize={8} />
                            <VStack>
                                <Text>30.42 ETH</Text>
                                <StyledText fontSize="sm" color="gray.400">
                                    $30,457.43
                                </StyledText>
                            </VStack>
                        </HStack>
                    </Td>
                    <Td borderBottom={0} valign="top">
                        <Button bgColor="#353E80" borderRadius="10px" color="white">
                            Add Liquidity
                        </Button>
                    </Td>
                </Tr>
                {/* {data.map((row: PoolsTableUnit) => {
                    const poolSummary = createPoolSummary(row)
                    return (
                        <Tr
                            _hover={{ backgroundColor: "black.alpha800", opacity: "0.7", cursor: "pointer" }}
                            onClick={() => handleOnClick(row.address)}
                        >
                            <Td borderBottom={0} verticalAlign="middle">
                                <CurrencyIcon symbol={row.baseSymbolDisplay} />
                                <CurrencyIcon symbol={row.quoteSymbolDisplay} />{" "}
                                <span style={{ verticalAlign: "middle" }}>{poolSummary.poolName}</span>
                            </Td>
                            <Td borderBottom={0}>{poolSummary.tvl}</Td>
                            <Td borderBottom={0}>{poolSummary.volume24h}</Td>
                        </Tr>
                    )
                })} */}
            </Tbody>
        </Table>
    )
}

export default PoolsTable
