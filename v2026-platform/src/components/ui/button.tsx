import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
    {
        variants: {
            variant: {
                primary:
                    "bg-[##001AED] text-white hover:bg-[##001AED]/90 hover:shadow-[0_10px_15px_-3px_rgba(0,26,237,0.5)] focus:ring-[##001AED]/50",
                secondary:
                    "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-[#00FF66] focus:ring-[#00FF66]/50",
                ghost:
                    "bg-transparent text-white border border-[#00FF66] hover:bg-[#00FF66]/10 hover:border-[#33FF85] focus:ring-[#00FF66]/50",
            },
        },
        defaultVariants: {
            variant: "primary",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
