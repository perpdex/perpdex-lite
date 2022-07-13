import React from "react"
import { Box } from "@chakra-ui/react"
import CardHeading from "component/base/CardHeading"

interface BorderFramePanelState {
    title?: string
    p?: number
    pb?: number
    w?: number
    children: React.ReactNode
}

function BorderFramePanel({ title, p, w, children }: BorderFramePanelState) {
    return (
        <>
            <Box
                borderColor="#728BEC"
                borderWidth={{ base: "0px", md: "1px" }}
                borderRadius="10px"
                w={w || "100%"}
                p={p || 6}
                mx={{ base: "auto", md: "0" }}
            >
                {title && <CardHeading text={title} />}
                {children}
            </Box>
        </>
    )
}

export default BorderFramePanel
