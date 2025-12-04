"use client"

import type React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "destructive" | "ghost"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading,
  children,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  }

  const variantStyles = {
    primary: "bg-primary text-primary-foreground hover:bg-opacity-90 active:scale-95 shadow-md hover:shadow-lg",
    secondary: "bg-secondary text-secondary-foreground hover:bg-opacity-80 border border-border",
    destructive: "bg-destructive text-destructive-foreground hover:bg-opacity-90 active:scale-95",
    ghost: "text-foreground hover:bg-secondary active:scale-95",
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className || ""}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  )
}
