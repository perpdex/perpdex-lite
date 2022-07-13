import React from "react"
import { Box, Text } from "@chakra-ui/react"

interface BorderFramePanelState {
    title?: string
    p?: number
    children: React.ReactNode
}

function BorderFramePanel({ title, p, children }: BorderFramePanelState) {
    return (
        <>
            <Box
                w="100%"
                borderColor="#728BEC"
                borderWidth={{ base: "0px", md: "1px" }}
                borderRadius="10px"
                p={p || 6}
                mx={{ base: "auto", md: "0" }}
            >
                {title && <Text fontSize="xl">{title}</Text>}
                {children}
            </Box>
        </>
    )
}

export default BorderFramePanel
