import { useState, type ReactNode } from 'react'
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

  return (
    <div className={cn('rounded-xl border border-slate-200 bg-card shadow-sm', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
      >
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
        <span className="text-sm text-primary">{open ? 'Свернуть' : 'Развернуть'}</span>
      </button>
      {open && <div className="border-t border-slate-100 px-4 py-3">{children}</div>}
    </div>
  )
}
