import { cn } from "../../lib/utils"

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
  color?: string
}

export function ShinyText({
  text,
  disabled = false,
  speed = 5,
  className,
  color = "#0DFF00"
}: ShinyTextProps) {
  return (
    <div
      className={cn(
        "inline-block bg-clip-text text-transparent",
        !disabled && "animate-shine",
        className
      )}
      style={{
        backgroundImage: `linear-gradient(120deg, 
          ${color}CC 40%, 
          ${color} 50%, 
          ${color}CC 60%
        )`,
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        animationDuration: `${speed}s`,
      } as React.CSSProperties}
    >
      {text}
    </div>
  )
}