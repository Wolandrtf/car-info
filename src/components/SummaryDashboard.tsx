import type {
  CategorySpending,
  MileagePoint,
  YearlySpending,
} from '../types'
import { CATEGORY_LABELS } from '../constants/categoryColors'
import { KpiCard } from './ui/KpiCard'
import { formatCurrency, formatDateShort, formatMileage } from '../utils/formatters'

interface SummaryDashboardProps {
  visitCount: number
  totalSpending: number
  dateRange: { from: string; to: string }
  yearlySpending: YearlySpending[]
  mileagePoints: MileagePoint[]
  categorySpending: CategorySpending[]
}

export function SummaryDashboard({
  visitCount,
  totalSpending,
  dateRange,
  yearlySpending,
  mileagePoints,
  categorySpending,
}: SummaryDashboardProps) {
  const maxYearAmount = Math.max(...yearlySpending.map((item) => item.amount), 1)
  const latestMileage = mileagePoints.at(-1)

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
          value={latestMileage ? formatMileage(latestMileage.mileage) : '—'}
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
        <h3 className="text-lg font-semibold text-slate-900">Пробег по визитам</h3>
        {mileagePoints.length === 0 ? (
          <p className="mt-3 text-sm text-muted">Данные о пробеге отсутствуют.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {mileagePoints.map((point) => (
              <li
                key={`${point.date}-${point.mileage}`}
                className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm"
              >
                <span>{formatDateShort(point.date)}</span>
                <span className="font-medium text-slate-900">{formatMileage(point.mileage)}</span>
              </li>
            ))}
          </ul>
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
