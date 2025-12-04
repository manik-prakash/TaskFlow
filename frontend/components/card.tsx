import type React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border bg-card text-card-foreground shadow-sm ${className || ""}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`px-6 py-4 border-b border-border ${className || ""}`}>{children}</div>
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`px-6 py-4 ${className || ""}`}>{children}</div>
}

export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`px-6 py-4 border-t border-border flex gap-2 justify-end ${className || ""}`}>{children}</div>
}
