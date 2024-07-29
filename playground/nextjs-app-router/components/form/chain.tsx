import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AppContext } from "../AppProvider"
import { useContext } from "react"

export function Chain() {
    const {chainId, setChainId} = useContext(AppContext)

    return (
        <div className="grid gap-2">
            <Label htmlFor="chain">Chain</Label>
            <Select value={chainId?.toString()} onValueChange={(value) => !value ? value : setChainId?.(parseInt(value))}>
                <SelectTrigger>
                    <SelectValue placeholder="Select chain" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="84532">Base Sepolia</SelectItem>
                    <SelectItem value="8453">Base</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}