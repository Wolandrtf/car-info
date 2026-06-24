import { useState } from 'react'
import type { ServiceVisit } from '../types'
import { Badge } from './ui/Badge'
import { formatCurrency, formatDate, formatMileage } from '../utils/formatters'

interface VisitCardProps {
  visit: ServiceVisit
}

export function VisitCard({ visit }: VisitCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="relative rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5">
      <div className="absolute -left-[33px] top-6 hidden h-4 w-4 rounded-full border-2 border-white bg-primary md:block" />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{formatDate(visit.date)}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {visit.organizations.map((org) => (
              <span
                key={org}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
              >
                {org}
              </span>
            ))}
          </div>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(visit.totalAmount)}</p>
          {visit.mileage != null && (
            <p className="mt-1 text-sm text-muted">{formatMileage(visit.mileage)}</p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="mt-4 text-sm font-medium text-primary"
      >
        {expanded ? 'Скрыть детали' : 'Показать детали'}
      </button>

      {expanded && (
        <div className="mt-4 space-y-5 border-t border-slate-100 pt-4">
          {visit.works.length > 0 && (
            <section>
              <h4 className="mb-2 text-sm font-semibold text-slate-900">Работы</h4>
              <ul className="space-y-2">
                {visit.works.map((work, index) => (
                  <li
                    key={`${work.documentNumber}-${work.name}-${index}`}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="text-slate-800">{work.name}</p>
                      <p className="text-xs text-muted">{work.organization}</p>
                      {work.executors && work.executors.length > 0 && (
                        <p className="text-xs text-slate-500">
                          Исполнители: {work.executors.join(', ')}
                        </p>
                      )}
                    </div>
                    <span className="font-medium text-slate-900">
                      {formatCurrency(work.total ?? work.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {visit.parts.length > 0 && (
            <section>
              <h4 className="mb-2 text-sm font-semibold text-slate-900">Запчасти</h4>
              <ul className="space-y-2">
                {visit.parts.map((part, index) => (
                  <li
                    key={`${part.documentNumber}-${part.name}-${index}`}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm"
                  >
                    <div className="space-y-1">
                      <p className="text-slate-800">{part.name}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge category={part.category} label={part.label} />
                        <span className="text-xs text-muted">{part.organization}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium text-slate-900">{formatCurrency(part.price)}</p>
                      <p className="text-xs text-muted">× {part.quantity}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h4 className="mb-2 text-sm font-semibold text-slate-900">Документы</h4>
            <ul className="space-y-1 text-sm text-slate-600">
              {visit.documents.map((document) => (
                <li key={`${document.type}-${document.number}`}>
                  {document.type === 'receipt' ? 'Чек' : 'Заказ-наряд'} № {document.number} ·{' '}
                  {document.supplier}
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </article>
  )
}
