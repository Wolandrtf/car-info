import type { MaintenanceScheduleItem, MaintenanceStatus } from '../utils/maintenanceSchedule'
import { KpiCard } from './ui/KpiCard'
import { cn } from '../utils/cn'
import { formatDateShort, formatMileage } from '../utils/formatters'

interface MaintenanceScheduleSectionProps {
  vehicleLabel: string
  currentMileage: number | null
  items: MaintenanceScheduleItem[]
  overdueCount: number
  dueSoonCount: number
}

const STATUS_LABELS: Record<MaintenanceStatus, string> = {
  overdue: 'Просрочено',
  due_soon: 'Скоро',
  ok: 'В норме',
  no_history: 'Нет данных',
  unknown_mileage: 'Нет пробега',
}

const STATUS_CLASSES: Record<MaintenanceStatus, string> = {
  overdue: 'bg-red-100 text-red-800',
  due_soon: 'bg-amber-100 text-amber-800',
  ok: 'bg-emerald-100 text-emerald-800',
  no_history: 'bg-slate-100 text-slate-600',
  unknown_mileage: 'bg-slate-100 text-slate-500',
}

function isCriticalAlert(item: MaintenanceScheduleItem): boolean {
  return item.kind === 'critical' && (item.status === 'overdue' || item.status === 'due_soon')
}

function ScheduleRow({ item }: { item: MaintenanceScheduleItem }) {
  const alert = isCriticalAlert(item)

  return (
    <tr
      className={cn(
        'border-b border-slate-100 text-sm',
        alert && 'bg-red-50',
        item.kind === 'critical' && 'border-l-4 border-l-red-400',
      )}
    >
      <td className="py-3 pr-4 align-top">
        <p className={cn('font-medium', alert ? 'text-red-900' : 'text-slate-900')}>
          {item.label}
        </p>
        <p className="mt-1 text-xs text-muted">{item.recommendation}</p>
      </td>
      <td className="py-3 pr-4 align-top whitespace-nowrap text-slate-700">
        ~{item.normKm.toLocaleString('ru-RU')} км
      </td>
      <td className="py-3 pr-4 align-top text-slate-700">
        {item.lastReplacement ? (
          <>
            <p>{formatDateShort(item.lastReplacement.date)}</p>
            {item.lastReplacement.mileage != null && (
              <p className="text-xs text-muted">
                {formatMileage(item.lastReplacement.mileage)}
                {item.lastReplacement.mileageEstimated && ' (оценка)'}
              </p>
            )}
          </>
        ) : (
          <span className="text-muted">—</span>
        )}
      </td>
      <td className="py-3 pr-4 align-top text-slate-700">
        {item.kmSinceLast != null ? formatMileage(item.kmSinceLast) : '—'}
      </td>
      <td className="py-3 pr-4 align-top text-slate-700">
        {item.nextDueMileage != null ? (
          <>
            <p>{formatMileage(item.nextDueMileage)}</p>
            {item.kmUntilDue != null && (
              <p className="text-xs text-muted">
                {item.kmUntilDue >= 0
                  ? `ещё ${formatMileage(item.kmUntilDue)}`
                  : `просрочено на ${formatMileage(Math.abs(item.kmUntilDue))}`}
              </p>
            )}
          </>
        ) : (
          '—'
        )}
      </td>
      <td className="py-3 align-top">
        <span
          className={cn(
            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium',
            STATUS_CLASSES[item.status],
          )}
        >
          {STATUS_LABELS[item.status]}
        </span>
        <p className={cn('mt-1 text-xs', alert ? 'text-red-700' : 'text-muted')}>
          {item.statusNote}
        </p>
      </td>
    </tr>
  )
}

function ScheduleCard({ item }: { item: MaintenanceScheduleItem }) {
  const alert = isCriticalAlert(item)

  return (
    <div
      className={cn(
        'rounded-lg border p-4 text-sm',
        alert ? 'border-red-300 bg-red-50' : 'border-slate-200',
        item.kind === 'critical' && !alert && 'border-red-200',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className={cn('font-medium', alert ? 'text-red-900' : 'text-slate-900')}>
          {item.label}
        </p>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium',
            STATUS_CLASSES[item.status],
          )}
        >
          {STATUS_LABELS[item.status]}
        </span>
      </div>
      <p className="mt-2 text-muted">{item.recommendation}</p>
      <p className="mt-2 text-slate-700">
        Регламент: ~{item.normKm.toLocaleString('ru-RU')} км
      </p>
      {item.lastReplacement && (
        <p className="mt-1 text-slate-700">
          Последняя замена: {formatDateShort(item.lastReplacement.date)}
          {item.lastReplacement.mileage != null &&
            ` · ${formatMileage(item.lastReplacement.mileage)}`}
        </p>
      )}
      {item.nextDueMileage != null && (
        <p className="mt-1 text-slate-700">
          Следующая ~{formatMileage(item.nextDueMileage)}
          {item.kmUntilDue != null &&
            (item.kmUntilDue >= 0
              ? ` (ещё ${formatMileage(item.kmUntilDue)})`
              : ` (просрочено на ${formatMileage(Math.abs(item.kmUntilDue))})`)}
        </p>
      )}
      <p className={cn('mt-2 text-xs', alert ? 'text-red-700' : 'text-muted')}>
        {item.statusNote}
      </p>
    </div>
  )
}

function ScheduleGroup({
  title,
  description,
  items,
  variant = 'default',
}: {
  title: string
  description?: string
  items: MaintenanceScheduleItem[]
  variant?: 'default' | 'critical'
}) {
  if (items.length === 0) return null

  return (
    <div className="space-y-3">
      <div>
        <h4
          className={cn(
            'text-sm font-semibold',
            variant === 'critical' ? 'text-red-900' : 'text-slate-900',
          )}
        >
          {title}
        </h4>
        {description && (
          <p
            className={cn(
              'mt-1 text-sm',
              variant === 'critical' ? 'text-red-800' : 'text-muted',
            )}
          >
            {description}
          </p>
        )}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-xs text-muted">
              <th className="py-2 pr-4 font-medium">Узел</th>
              <th className="py-2 pr-4 font-medium">Норма</th>
              <th className="py-2 pr-4 font-medium">Последняя замена</th>
              <th className="py-2 pr-4 font-medium">С прошлой замены</th>
              <th className="py-2 pr-4 font-medium">Следующая замена</th>
              <th className="py-2 font-medium">Статус</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ScheduleRow key={item.intervalId} item={item} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <ScheduleCard key={item.intervalId} item={item} />
        ))}
      </div>
    </div>
  )
}

export function MaintenanceScheduleSection({
  vehicleLabel,
  currentMileage,
  items,
  overdueCount,
  dueSoonCount,
}: MaintenanceScheduleSectionProps) {
  const critical = items.filter((item) => item.kind === 'critical')
  const planned = items.filter((item) => item.kind === 'planned')
  const wear = items.filter((item) => item.kind === 'wear')
  const criticalAlerts = critical.filter((item) => isCriticalAlert(item)).length

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-card p-4 text-sm text-slate-600 shadow-sm md:p-5">
        <h2 className="text-lg font-semibold text-slate-900">Работы по регламенту</h2>
        <p className="mt-2">
          Ориентиры для {vehicleLabel}: плановое ТО и типичный ресурс износных узлов.
          Расчёт от последней замены в истории и текущего пробега
          {currentMileage != null ? ` (${formatMileage(currentMileage)})` : ''}.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Текущий пробег"
          value={currentMileage != null ? formatMileage(currentMileage) : '—'}
          subtitle="По последнему заказ-наряду"
        />
        <KpiCard
          title="Просрочено"
          value={String(overdueCount)}
          subtitle="Пора менять по пробегу"
        />
        <KpiCard
          title="Скоро по регламенту"
          value={String(dueSoonCount)}
          subtitle="Менее 15% ресурса"
        />
        <KpiCard
          title="Критично"
          value={String(criticalAlerts)}
          subtitle="ГРМ, CVT — требуют внимания"
          className={criticalAlerts > 0 ? 'border-red-200 bg-red-50/50' : undefined}
        />
      </div>

      {critical.length > 0 && (
        <section className="rounded-xl border-2 border-red-200 bg-red-50/30 p-4 shadow-sm md:p-5">
          <ScheduleGroup
            title="Критично"
            description="Обязательная замена — пропуск может привести к дорогостоящему ремонту"
            items={critical}
            variant="critical"
          />
        </section>
      )}

      <section className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5">
        <ScheduleGroup title="Плановое ТО" items={planned} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:p-5">
        <ScheduleGroup title="Износные узлы" items={wear} />
      </section>
    </div>
  )
}
