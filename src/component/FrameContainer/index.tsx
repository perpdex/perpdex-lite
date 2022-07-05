import React from "react"
import { Flex, Box } from "@chakra-ui/react"

interface FrameContainerProps {
    removeMarginTop?: boolean
    children: React.ReactNode
}

function FrameContainer({ removeMarginTop, children }: FrameContainerProps) {
    return (
        <Flex justifyContent="center">
            <Box mt={removeMarginTop ? "0" : "8"} minWidth={1200} maxWidth={1600}>
                {children}
            </Box>
        </Flex>
    )
}

export default FrameContainer
