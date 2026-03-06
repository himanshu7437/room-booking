import { forwardRef } from "react";

const Button = forwardRef(
  (
    {
      variant = "primary",
      size = "md",
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

    const variants = {
      primary:
        "bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-md hover:shadow-lg hover:brightness-110",

      secondary:
        "bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm",

      accent:
        "bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold shadow-md hover:shadow-lg hover:brightness-105",

      ghost:
        "text-primary-600 hover:bg-primary-50",

      danger:
        "bg-red-600 text-white hover:bg-red-700 shadow-md",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;