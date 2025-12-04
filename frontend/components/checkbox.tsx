import type React from "react"

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        className={`w-5 h-5 rounded border-2 border-border cursor-pointer accent-primary ${className || ""}`}
        {...props}
      />
      {label && <label className="text-sm font-medium text-foreground cursor-pointer">{label}</label>}
    </div>
  )
}
