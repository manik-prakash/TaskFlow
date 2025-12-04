"use client"

import type React from "react"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-foreground mb-2">{label}</label>}
      <input
        className={`w-full px-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background transition-all duration-200 ${
          error ? "border-destructive focus:ring-destructive" : ""
        } ${className || ""}`}
        {...props}
      />
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  )
}
