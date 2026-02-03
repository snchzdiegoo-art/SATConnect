import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8",
                    hover && "transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,26,237,0.3)]",
                    className
                )}
                {...props}
            />
        )
    }
)
Card.displayName = "Card"

export { Card }
