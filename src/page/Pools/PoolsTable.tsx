import { Table, Thead, Tbody, Tr, Td, Text, HStack, VStack } from "@chakra-ui/react"
import { MarketState } from "../../constant/types"
import { CurrencyIcon } from "../../component/Icon"
import { createPoolSummary } from "../../util/market"
import Button from "component/base/Button"
import { StyledAnnotation, StyledTh } from "component/tables"

export interface PoolsTableState {
    data: MarketState[]
    handleOnClick: (address: string) => void
}

function PoolsTable({ data, handleOnClick }: PoolsTableState) {
    return (
        <Table variant="simple">
            <Thead height={68}>
                <Tr>
                    <StyledTh>Pool Name</StyledTh>
                    <StyledTh>Liquidity</StyledTh>
                    <StyledTh></StyledTh>
                </Tr>
            </Thead>
            <Tbody>
                {data.map((row: MarketState) => {
                    const poolSummary = createPoolSummary(row)

                    return (
                        <Tr>
                            <Td borderBottom={0}>
                                <HStack>
                                    <CurrencyIcon symbol={"TODO: poolSummary.baseSymbolDisplay"} boxSize={8} />
                                    <Text>{row.name}</Text>
                                </HStack>
                            </Td>
                            <Td borderBottom={0}>
                                <HStack>
                                    <VStack alignItems="start">
                                        <Text>{poolSummary.tvl}</Text>
                                        <StyledAnnotation fontSize="sm" color="gray.400">
                                            {poolSummary.tvlUsd}
                                        </StyledAnnotation>
                                    </VStack>
                                </HStack>
                            </Td>
                            <Td borderBottom={0}>
                                <Button
                                    customType="base-blue"
                                    text="Add Liquidity"
                                    onClick={() => handleOnClick(row.address)}
                                />
                            </Td>
                        </Tr>
                    )
                })}
            </Tbody>
        </Table>
    )
}

export default PoolsTable
