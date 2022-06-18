import { useEffect, useCallback, useRef } from "react"

export function useContractCall(fn: Function, deps: any[]) {
    const savedCallback = useRef<Function>()

    useEffect(() => {
        savedCallback.current = fn
    }, [fn])

    const memoizedCallback = useCallback(
        (...args) => {
            if (savedCallback.current) {
                const _fn = savedCallback.current
                return _fn(...args)
            }
        },
        // TODO: if we do `...deps` here, eslint won't help us find missing deps statically,
        // we might need to find a way to fix it
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [...deps],
    )

    return memoizedCallback
}
