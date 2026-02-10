
"use client"

import * as React from "react"
// import * as SeparatorPrimitive from "@radix-ui/react-separator"

import { cn } from "@/lib/utils"

const Separator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }
>(
    (
        { className, orientation = "horizontal", ...props },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                "shrink-0 bg-border bg-gray-200",
                orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
                className
            )}
            {...props}
        />
    )
)
Separator.displayName = "Separator"

// This component is no longer using Radix UI's SeparatorPrimitive.Root,
// so the import for SeparatorPrimitive is technically not needed for this file's functionality.
// However, the user's instruction only specified changes to the Separator component itself,
// not the imports. I will keep the import as is, as per the instruction to make faithful changes.

export { Separator }
