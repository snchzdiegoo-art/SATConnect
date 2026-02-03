import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                success:
                    "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
                popular:
                    "bg-[#00FF66]/10 text-[#00FF66] border border-[#00FF66]/30",
                blue:
                    "bg-blue-500/10 text-blue-400 border border-blue-500/30",
                purple:
                    "bg-purple-500/10 text-purple-400 border border-purple-500/30",
                primary:
                    "bg-teal-500/10 text-teal-400 border border-teal-500/30",
                outline:
                    "text-foreground",

            },
        },
        defaultVariants: {
            variant: "success",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
