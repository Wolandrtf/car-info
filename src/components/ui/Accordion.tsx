import { useId, useState, type ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface AccordionProps {
  title: string
  subtitle?: string
  defaultOpen?: boolean
  children: ReactNode
  className?: string
}

export function Accordion({
  title,
  subtitle,
  defaultOpen = false,
  children,
  className,
}: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()
  const headerId = useId()

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-card shadow-sm', className)}>
      <button
        type="button"
        id={headerId}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <span className="text-sm text-primary" aria-hidden="true">
          {open ? 'Свернуть' : 'Развернуть'}
        </span>
      </button>
      {open && (
        <div id={panelId} role="region" aria-labelledby={headerId} className="border-t border-slate-100 px-4 py-3">
          {children}
        </div>
      )}
    </div>
  )
}
