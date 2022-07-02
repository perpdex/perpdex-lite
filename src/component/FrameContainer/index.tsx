import React from "react"
import { Flex, Box } from "@chakra-ui/react"

interface FrameContainerProps {
    children: React.ReactNode
}

function FrameContainer({ children }: FrameContainerProps) {
    return (
        <Flex justifyContent="center">
            <Box mt={8} maxWidth={1600} w="100%">
                {children}
            </Box>
        </Flex>
    )
}

export default FrameContainer
