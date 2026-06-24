import type { PartReplacementHistory } from '../types'
import { CATEGORY_LABELS } from '../constants/categoryColors'
import { groupPartHistoryByCategory } from '../hooks/useServiceData'
import { Accordion } from './ui/Accordion'
import { formatCurrency, formatDateShort } from '../utils/formatters'

interface PartsByCategoryProps {
  partHistory: PartReplacementHistory[]
}

export function PartsByCategory({ partHistory }: PartsByCategoryProps) {
  const grouped = groupPartHistoryByCategory(partHistory)
  const categories = [...grouped.keys()].sort((a, b) =>
    (CATEGORY_LABELS[a as keyof typeof CATEGORY_LABELS] ?? a).localeCompare(
      CATEGORY_LABELS[b as keyof typeof CATEGORY_LABELS] ?? b,
      'ru',
    ),
  )

  if (partHistory.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-card p-8 text-center text-muted">
        История запчастей пуста.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const items = grouped.get(category) ?? []
        const categoryLabel =
          CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] ?? category

        return (
          <Accordion
            key={category}
            title={categoryLabel}
            subtitle={`${items.length} типов запчастей`}
          >
            <div className="space-y-4">
              {items.map((group) => (
                <div key={`${group.category}-${group.label}`}>
                  <h4 className="mb-2 font-medium text-slate-900">
                    {group.label}{' '}
                    <span className="text-sm font-normal text-muted">
                      ({group.events.length} замен)
                    </span>
                  </h4>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-left text-muted">
                          <th className="py-2 pr-4">Дата</th>
                          <th className="py-2 pr-4">Организация</th>
                          <th className="py-2 pr-4">Наименование</th>
                          <th className="py-2 pr-4">Кол-во</th>
                          <th className="py-2">Цена</th>
                        </tr>
                      </thead>
                      <tbody>
                        {group.events.map((event) => (
                          <tr
                            key={`${event.date}-${event.documentNumber}-${event.name}`}
                            className="border-b border-slate-100"
                          >
                            <td className="py-2 pr-4">{formatDateShort(event.date)}</td>
                            <td className="py-2 pr-4">{event.organization}</td>
                            <td className="py-2 pr-4">{event.name}</td>
                            <td className="py-2 pr-4">{event.quantity}</td>
                            <td className="py-2">{formatCurrency(event.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-2 md:hidden">
                    {group.events.map((event) => (
                      <div
                        key={`${event.date}-${event.documentNumber}-${event.name}-mobile`}
                        className="rounded-lg border border-slate-200 p-3 text-sm"
                      >
                        <p className="font-medium text-slate-900">{event.name}</p>
                        <p className="mt-1 text-muted">{formatDateShort(event.date)}</p>
                        <p className="text-muted">{event.organization}</p>
                        <p className="mt-1">
                          {event.quantity} шт. · {formatCurrency(event.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Accordion>
        )
      })}
    </div>
  )
}
