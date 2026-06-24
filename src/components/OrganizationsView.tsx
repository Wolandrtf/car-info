import type { OrganizationStats } from '../types'
import { formatCurrency, formatDateShort } from '../utils/formatters'

interface OrganizationsViewProps {
  organizations: OrganizationStats[]
  onDateClick?: (date: string) => void
}

export function OrganizationsView({ organizations, onDateClick }: OrganizationsViewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {organizations.map((org) => (
        <article
          key={org.inn}
          className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5"
        >
          <h3 className="text-lg font-semibold text-slate-900">{org.name}</h3>
          <p className="mt-1 text-sm text-muted">ИНН: {org.inn}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-muted">Визитов</p>
              <p className="text-xl font-semibold text-slate-900">{org.visitCount}</p>
            </div>
            <div className="rounded-lg bg-slate-50 p-3">
              <p className="text-xs text-muted">Сумма</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatCurrency(org.totalAmount)}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-slate-900">Даты визитов</p>
            <div className="flex flex-wrap gap-2">
              {org.dates.map((date) => (
                <button
                  key={date}
                  type="button"
                  onClick={() => onDateClick?.(date)}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700 hover:bg-primary/10 hover:text-primary"
                >
                  {formatDateShort(date)}
                </button>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
