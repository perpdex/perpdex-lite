import React from "react"
import { Flex, Box } from "@chakra-ui/react"

interface FrameContainerProps {
    children: React.ReactNode
}

function FrameContainer({ children }: FrameContainerProps) {
    return (
        <Flex justifyContent="center">
            <Box mt={8} minWidth={1200} maxWidth={1600}>
                {children}
            </Box>
        </Flex>
    )
}

export default FrameContainer
