import React from "react"
import { Box } from "@chakra-ui/react"

interface FrameContainerProps {
    children: React.ReactNode
}

function FrameContainer({ children }: FrameContainerProps) {
    return <Box mt={4}>{children}</Box>
}

export default FrameContainer
