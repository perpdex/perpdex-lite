import { chakra, Th, Td, Text } from "@chakra-ui/react"

export const StyledTh = chakra(Th, {
    baseStyle: {
        color: "white",
        borderBottom: { base: "0px none", md: "1px solid #627EEA" },
        fontSize: "lg",
    },
})

export const StyledTd = chakra(Td, {
    baseStyle: {
        borderBottom: "0px none",
    },
})

export const StyledAnnotation = chakra(Text, {
    baseStyle: {
        marginTop: "0px !important",
    },
})
