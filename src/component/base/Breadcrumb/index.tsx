import { Breadcrumb as ChakraBreadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRightIcon } from "@chakra-ui/icons"
import { Link as ReactLink } from "react-router-dom"

export interface BreadcrumbUnit {
    name: string
    to?: string
}

export interface BreadCrumbState {
    layers: BreadcrumbUnit[]
}

function Breadcrumb({ layers }: BreadCrumbState) {
    return (
        <ChakraBreadcrumb mb="4" spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            {layers.map((layer: BreadcrumbUnit, index: number) => (
                <BreadcrumbItem key={index}>
                    {layers.length - 1 !== index ? (
                        layer.to ? (
                            <BreadcrumbLink as={ReactLink} to={layer.to}>
                                {layer.name}
                            </BreadcrumbLink>
                        ) : (
                            <BreadcrumbLink>{layer.name}</BreadcrumbLink>
                        )
                    ) : (
                        <div>{layer.name}</div>
                    )}
                </BreadcrumbItem>
            ))}
        </ChakraBreadcrumb>
    )
}

export default Breadcrumb
