import * as React from "react"
import { cn } from "@/utils/cn"
import { Loader2 } from "lucide-react"

const Button = React.forwardRef(({ className, variant = "default", size = "default", isLoading, children, ...props }, ref) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        {
          "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md focus:ring-indigo-500": variant === "default",
          "bg-teal-500 text-white hover:bg-teal-600 hover:shadow-md focus:ring-teal-500": variant === "secondary",
          "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500": variant === "danger",
          "bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500": variant === "outline",
          "bg-transparent text-gray-700 hover:bg-gray-100": variant === "ghost",
          "h-10 py-2 px-4": size === "default",
          "h-8 px-3 text-xs": size === "sm",
          "h-12 px-8 text-lg": size === "lg",
          "p-2": size === "icon",
        },
        className
      )}
      ref={ref}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
})
Button.displayName = "Button"

export { Button }
