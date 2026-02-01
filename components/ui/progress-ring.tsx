
"use client"

import { cn } from "@/lib/utils"

interface ProgressRingProps {
  radius?: number
  stroke?: number
  progress: number
  className?: string
  color?: string
  label?: string
  subLabel?: string
  icon?: React.ReactNode
}

export function ProgressRing({
  radius = 60,
  stroke = 8,
  progress,
  className,
  color = "text-primary",
  label,
  subLabel,
  icon
}: ProgressRingProps) {
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="rotate-[-90deg] transition-all duration-500"
      >
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="text-muted/20"
        />
        <circle
          stroke="currentColor"
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className={cn("transition-all duration-1000 ease-out", color)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {icon && <div className="mb-1">{icon}</div>}
        {label && <span className="text-2xl font-bold">{label}</span>}
        {subLabel && <span className="text-xs text-muted-foreground">{subLabel}</span>}
      </div>
    </div>
  )
}
