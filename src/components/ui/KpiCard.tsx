import { cn } from '../../utils/cn'

interface KpiCardProps {
  title: string
  value: string
  subtitle?: string
  className?: string
}

export function KpiCard({ title, value, subtitle, className }: KpiCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 bg-card p-4 shadow-sm',
        className,
      )}
    >
      <p className="text-sm text-muted">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
      {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
    </div>
  )
}
