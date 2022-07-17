import { Table, Thead, Tbody, Tr, Td, Text, HStack, VStack } from "@chakra-ui/react"
import { MakerInfo, MarketState } from "../../constant/types"
import { CurrencyIcon } from "../../component/Icon"
import { createMakerPositionInfo, createPoolSummary } from "../../util/market"
import Button from "component/base/Button"
import { StyledAnnotation, StyledTh } from "component/tables"
import { numberWithCommas } from "../../util/format"

export interface PoolsTableState {
    data: [MarketState, MakerInfo][]
    handleOnClick: (address: string) => void
}

function PoolsTable({ data, handleOnClick }: PoolsTableState) {
    return (
        <Table variant="simple">
            <Thead height={68}>
                <Tr>
                    <StyledTh>Pool Name</StyledTh>
                    <StyledTh>TVL</StyledTh>
                    <StyledTh>My Liquidity</StyledTh>
                    <StyledTh></StyledTh>
                </Tr>
            </Thead>
            <Tbody>
                {data.map(([row, makerInfo]) => {
                    const poolSummary = createPoolSummary(row)
                    const makerPositionInfo = createMakerPositionInfo(row, makerInfo)

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
                                <HStack>
                                    <VStack alignItems="start">
                                        <Text>
                                            {numberWithCommas(makerPositionInfo?.liquidityValue)} {row.quoteSymbol}
                                        </Text>
                                        <StyledAnnotation fontSize="sm" color="gray.400">
                                            ${numberWithCommas(makerPositionInfo?.liquidityValueUsd)}
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
