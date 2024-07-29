import { AppContext } from "@/components/AppProvider";
import { useContext } from "react";

export function usePaymaster() {
    const {chainId, paymasters} = useContext(AppContext)
    const paymasterUrl = !chainId ? "" : paymasters?.[chainId]?.url ?? ""
    const enabled = !chainId ? false : paymasters?.[chainId]?.enabled ?? false

    return {
        paymasterUrl,
        enabled
    }
}

export function useCapabilities() {
    const {paymasterUrl, enabled} = usePaymaster()

    return enabled ? {
        ...(paymasterUrl && {
            paymasterService: { url: paymasterUrl }
        })
    } : undefined
}