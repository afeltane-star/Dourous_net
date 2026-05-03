import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

export default function Card({ className, hover, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-sm transition-all",
        hover && "hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
