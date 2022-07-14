import {
    Modal as ChakuraModal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalContentProps,
} from "@chakra-ui/react"
import { ReactNode } from "react"

export interface ModalState extends Partial<ModalContentProps> {
    headerText: string
    isOpen: boolean
    onClose: () => void
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "3xl" | "4xl" | "5xl" | "6xl"
    body: ReactNode
    footer?: ReactNode
}

function Modal({ headerText, isOpen, onClose, size, body, footer, ...props }: ModalState) {
    return (
        <ChakuraModal isCentered={true} size={size || "xs"} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg="#050217" color="whiteAlpha.900" borderRadius="20px" {...props}>
                <ModalHeader fontWeight="bold" fontSize="lg">
                    {headerText}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb="1.5rem">{body}</ModalBody>
                {footer && <ModalFooter justifyContent="center">{footer}</ModalFooter>}
            </ModalContent>
        </ChakuraModal>
    )
}

export default Modal
