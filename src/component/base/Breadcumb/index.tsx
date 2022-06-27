import { Breadcrumb as ChakuraBreadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react"
import { ChevronRightIcon } from "@chakra-ui/icons"

export interface BreadcrumbUnit {
    name: string
    path?: string
}

export interface BreadCrumbState {
    layers: BreadcrumbUnit[]
}

function Breadcrumb({ layers }: BreadCrumbState) {
    return (
        <ChakuraBreadcrumb mb="4" spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            {layers.map((layer: BreadcrumbUnit, index: number) => (
                <BreadcrumbItem>
                    {layers.length - 1 !== index ? (
                        <BreadcrumbLink href={layer.path}>{layer.name}</BreadcrumbLink>
                    ) : (
                        <div>{layer.name}</div>
                    )}
                </BreadcrumbItem>
            ))}
        </ChakuraBreadcrumb>
    )
}

export default Breadcrumb
