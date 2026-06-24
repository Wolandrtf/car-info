import type {
  CategorySpending,
  MileageEntry,
  YearlySpending,
} from '../types'
import { CATEGORY_LABELS } from '../constants/categoryColors'
import { KpiCard } from './ui/KpiCard'
import { formatCurrency, formatDateShort, formatMileage } from '../utils/formatters'
import { cn } from '../utils/cn'

interface SummaryDashboardProps {
  visitCount: number
  totalSpending: number
  dateRange: { from: string; to: string }
  yearlySpending: YearlySpending[]
  mileageEntries: MileageEntry[]
  categorySpending: CategorySpending[]
  onDateClick?: (date: string) => void
}

export function SummaryDashboard({
  visitCount,
  totalSpending,
  dateRange,
  yearlySpending,
  mileageEntries,
  categorySpending,
  onDateClick,
}: SummaryDashboardProps) {
  const maxYearAmount = Math.max(...yearlySpending.map((item) => item.amount), 1)
  const entriesWithMileage = mileageEntries.filter((entry) => entry.mileage != null)
  const entriesWithoutMileage = mileageEntries.filter((entry) => entry.mileage == null)
  const latestMileage = entriesWithMileage.at(-1)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Период обслуживания"
          value={`${formatDateShort(dateRange.from)} — ${formatDateShort(dateRange.to)}`}
        />
        <KpiCard title="Визитов" value={String(visitCount)} />
        <KpiCard title="Всего потрачено" value={formatCurrency(totalSpending)} />
        <KpiCard
          title="Последний пробег"
          value={latestMileage ? formatMileage(latestMileage.mileage!) : '—'}
          subtitle={latestMileage ? formatDateShort(latestMileage.date) : undefined}
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-semibold text-slate-900">Расходы по годам</h3>
        <div className="mt-4 space-y-3">
          {yearlySpending.map((item) => (
            <div key={item.year}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-slate-800">{item.year}</span>
                <span className="text-muted">{formatCurrency(item.amount)}</span>
              </div>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className="h-3 rounded-full bg-primary/80"
                  style={{ width: `${(item.amount / maxYearAmount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Пробег по визитам</h3>
          {entriesWithoutMileage.length > 0 && (
            <p className="text-sm text-amber-700">
              Без пробега: {entriesWithoutMileage.length} из {mileageEntries.length}
            </p>
          )}
        </div>
        {mileageEntries.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Нет визитов с заказ-нарядами.</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted">
              Нажмите на визит, чтобы открыть его в хронологии.
            </p>
            <ul className="mt-4 space-y-2">
              {mileageEntries.map((entry) => {
                const hasMileage = entry.mileage != null

                return (
                  <li key={entry.date}>
                    <button
                      type="button"
                      onClick={() => onDateClick?.(entry.date)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        hasMileage
                          ? 'bg-slate-50 hover:bg-primary/10'
                          : 'border border-amber-200 bg-amber-50 hover:bg-amber-100',
                      )}
                    >
                      <span className="font-medium text-slate-800">
                        {formatDateShort(entry.date)}
                      </span>
                      {hasMileage ? (
                        <span className="font-medium text-slate-900">
                          {formatMileage(entry.mileage!)}
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-200/80 px-2 py-0.5 text-xs font-medium text-amber-900">
                          Пробег не указан
                        </span>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          </>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5">
        <h3 className="text-lg font-semibold text-slate-900">Топ категорий запчастей</h3>
        <div className="mt-4 space-y-3">
          {categorySpending.slice(0, 6).map((item) => (
            <div
              key={item.category}
              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
            >
              <div>
                <p className="font-medium text-slate-900">
                  {CATEGORY_LABELS[item.category]}
                </p>
                <p className="text-xs text-muted">{item.count} позиций</p>
              </div>
              <span className="font-medium text-slate-900">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
