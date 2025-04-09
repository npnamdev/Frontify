"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function DemoShareDocument() {
    return (
        <Select defaultValue="edit" onValueChange={() => console.log("namdev")}>
            <SelectTrigger className="ml-auto w-[110px]">
                <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="edit">Can edit</SelectItem>
                <SelectItem value="view">Can view</SelectItem>
            </SelectContent>
        </Select>
    )
}