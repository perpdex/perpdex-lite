import React from "react"
import { Box } from "@chakra-ui/react"
import { useRunAtAppStart } from "hook/useRunAtAppStart"

interface FrameContainerProps {
    children: React.ReactNode
}

function FrameContainer({ children }: FrameContainerProps) {
    useRunAtAppStart()

    return <Box mt={8}>{children}</Box>
}

export default FrameContainer
