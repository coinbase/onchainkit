import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { AppContext, OnchainKitComponent } from "../AppProvider"
import { useContext } from "react"

export function ActiveComponent() {
    const { activeComponent, setActiveComponent } = useContext(AppContext)

    return (
        <div className="grid gap-2">
            <Label htmlFor="chain">Component</Label>
            <Select value={activeComponent} onValueChange={(value) => !value ? value : setActiveComponent?.(value as OnchainKitComponent)}>
                <SelectTrigger>
                    <SelectValue placeholder="Select component" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={OnchainKitComponent.Transaction}>Transaction</SelectItem>
                    <SelectItem value={OnchainKitComponent.Swap}>Swap</SelectItem>
                </SelectContent>
            </Select>
        </div>
    )
}