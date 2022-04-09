import { Button } from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

function AddButton() {
    return (
        <Button isFullWidth size="md" leftIcon={<AddIcon />} colorScheme="pink" variant="solid">
            Add Liquidity
        </Button>
    )
}

export default AddButton
