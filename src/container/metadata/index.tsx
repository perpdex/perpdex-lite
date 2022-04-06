import { IS_MAINNET } from "constant"
import { useEffect, useState } from "react"
import { createContainer } from "unstated-next"
import axios from "axios"
import { JSONBIN } from "connector/index"

export const OldMetaData = createContainer(useMetaData)
export const NewMetaData = createContainer(useJsonBinMetaData)

const configUrl = `https://metadata.perp.exchange/${IS_MAINNET ? "production" : "staging"}.json`

function useMetaData() {
    const [config, setConfig] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        setIsLoading(true)

        fetch(configUrl)
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(e => {
                console.error(e)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    return {
        isLoading,
        config,
    }
}

async function readConfigFromJsonBin() {
    const headers = {
        "X-Master-Key": JSONBIN.key!,
    }

    const instance = axios.create({
        headers,
    })

    const path = JSONBIN.url!

    console.log("@@@@@ readConfigFromJsonBin", headers, path)

    try {
        const response = await instance.get(path)
        console.log(response.data.record)
        return response.data.record
    } catch (e) {
        console.log(e)
    }
}

function useJsonBinMetaData() {
    const [config, setConfig] = useState(undefined)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)

        ;(async () => {
            const data = await readConfigFromJsonBin()
            console.log("@@@@@ data", data)
            if (data) {
                setConfig(data)

                setIsLoading(false)
            }
        })()
    }, [])

    return {
        config,
        isLoading,
    }
}
