import React, { useCallback } from "react"
import { Button, Flex, Image, Spacer } from "@chakra-ui/react"
import { AbstractConnector } from "@web3-react/abstract-connector"
import CheckSvg from "../../../asset/check.svg"
import { User } from "container/connection/user"
import { Modal } from "container/modal"
import { useWeb3React } from "@web3-react/core"

function WalletButton({
    src,
    name,
    connector,
    id,
}: {
    src: string
    name: string
    connector: AbstractConnector
    id: string
}) {
    const {
        actions: { login },
    } = User.useContainer()
    const { connector: activeConnector } = useWeb3React()

    const {
        actions: { toggleWalletModal },
    } = Modal.useContainer()

    const isActiveConnector = activeConnector === connector

    const handleOnClick = useCallback(() => {
        if (!isActiveConnector) {
            login(connector, id)
        }
        toggleWalletModal()
    }, [connector, login, toggleWalletModal, id, isActiveConnector])

    return (
        <Button
            fontWeight="400"
            fontSize="md"
            justifyContent="left"
            bg="#334080"
            color="white"
            borderRadius="20px"
            onClick={handleOnClick}
            _hover={{ bg: "rgba(255, 255, 255, 0.16)" }}
        >
            <Flex width="100%" alignItems="center">
                <Image mr="10px" src={src} boxSize={8} />
                {name}
                <Spacer />
                {isActiveConnector && <Image src={CheckSvg} />}
            </Flex>
        </Button>
    )
}

export default WalletButton
