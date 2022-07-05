import { tsGenerator } from "ts-generator"
import { TypeChain } from "typechain/dist/TypeChain"

async function main() {
    const cwd = process.cwd()

    await tsGenerator(
        { cwd },
        new TypeChain({
            cwd,
            rawConfig: {
                files: `${__dirname}/../deps/perpdex-*/artifacts/contracts/**/+([a-zA-Z0-9_]).json`,
                outDir: "src/types/newContracts",
                target: "ethers-v5",
            },
        }),
    )
}

main().catch(console.error)
