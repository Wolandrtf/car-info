import type { IntervalComparison, IntervalVerdict, PartTypeTimeline } from '../utils/intervalAnalysis'
import { Accordion } from './ui/Accordion'
import { KpiCard } from './ui/KpiCard'
import { cn } from '../utils/cn'
import { formatDateShort, formatMileage } from '../utils/formatters'

interface IntervalAnalysisViewProps {
  vehicleLabel: string
  timelines: PartTypeTimeline[]
  earlyWear: IntervalComparison[]
  earlyPlanned: IntervalComparison[]
  duplicates: IntervalComparison[]
}

const VERDICT_LABELS: Record<IntervalVerdict, string> = {
  early_wear: 'Раньше нормы',
  early_planned: 'Чаще регламента',
  duplicate: 'Дубль в данных',
  ok: 'В норме',
  unknown: 'Нет данных',
}

const VERDICT_CLASSES: Record<IntervalVerdict, string> = {
  early_wear: 'bg-red-100 text-red-800',
  early_planned: 'bg-amber-100 text-amber-800',
  duplicate: 'bg-slate-100 text-slate-600',
  ok: 'bg-emerald-100 text-emerald-800',
  unknown: 'bg-slate-100 text-slate-500',
}

function ComparisonCard({ comparison }: { comparison: IntervalComparison }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-slate-900">{comparison.label}</p>
          <p className="mt-1 text-muted">{comparison.note}</p>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 text-xs font-medium',
            VERDICT_CLASSES[comparison.verdict],
          )}
        >
          {VERDICT_LABELS[comparison.verdict]}
        </span>
      </div>

      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <p>
          <span className="text-muted">Было:</span>{' '}
          {formatDateShort(comparison.prev.date)}
          {comparison.prev.mileage != null && (
            <span> · {formatMileage(comparison.prev.mileage)}</span>
          )}
        </p>
        <p>
          <span className="text-muted">Стало:</span>{' '}
          {formatDateShort(comparison.current.date)}
          {comparison.current.mileage != null && (
            <span> · {formatMileage(comparison.current.mileage)}</span>
          )}
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-4 text-sm">
        <span>
          Интервал:{' '}
          <strong>
            {comparison.deltaKm != null ? formatMileage(comparison.deltaKm) : '—'}
          </strong>
        </span>
        <span>
          Норма: <strong>{formatMileage(comparison.normKm)}</strong>
        </span>
        {comparison.percentOfNorm != null && (
          <span>
            От нормы: <strong>{comparison.percentOfNorm}%</strong>
          </span>
        )}
        <span>
          Дней: <strong>{comparison.deltaDays}</strong>
        </span>
      </div>

      <p className="mt-2 text-xs text-slate-500">{comparison.current.name}</p>
    </div>
  )
}

function TimelineSection({ timeline }: { timeline: PartTypeTimeline }) {
  const suspiciousCount = timeline.comparisons.filter(
    (item) => item.verdict === 'early_wear' || item.verdict === 'early_planned',
  ).length

  return (
    <Accordion
      title={timeline.label}
      subtitle={`Норма ~${timeline.normKm.toLocaleString('ru-RU')} км · ${timeline.events.length} замен · ${suspiciousCount} ранних`}
    >
      <div className="space-y-4">
        <ol className="space-y-2">
          {timeline.events.map((event, index) => {
            const comparison = index > 0 ? timeline.comparisons[index - 1] : undefined
            return (
              <li
                key={`${event.date}-${event.documentNumber}-${event.name}-${index}`}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-slate-900">
                    {formatDateShort(event.date)}
                  </span>
                  <span className="text-muted">
                    {event.mileage != null ? formatMileage(event.mileage) : 'пробег ?'}
                    {event.mileageEstimated && event.mileage != null && ' (оценка)'}
                  </span>
                </div>
                <p className="mt-1 text-slate-700">{event.name}</p>
                <p className="text-xs text-muted">{event.organization}</p>
                {comparison && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        VERDICT_CLASSES[comparison.verdict],
                      )}
                    >
                      {VERDICT_LABELS[comparison.verdict]}
                    </span>
                    {comparison.deltaKm != null && (
                      <span className="text-xs text-slate-500">
                        +{formatMileage(comparison.deltaKm)} с прошлой замены
                      </span>
                    )}
                  </div>
                )}
              </li>
            )
          })}
        </ol>

        {timeline.comparisons.some((item) => item.verdict !== 'ok') && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-900">Сравнения</p>
            {timeline.comparisons
              .filter((item) => item.verdict !== 'ok')
              .map((comparison) => (
                <ComparisonCard
                  key={`${comparison.current.date}-${comparison.current.name}`}
                  comparison={comparison}
                />
              ))}
          </div>
        )}
      </div>
    </Accordion>
  )
}

export function IntervalAnalysisView({
  vehicleLabel,
  timelines,
  earlyWear,
  earlyPlanned,
  duplicates,
}: IntervalAnalysisViewProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-card p-4 text-sm text-slate-600 shadow-sm md:p-5">
        <p>
          Сравниваем интервалы между заменами с ориентировочными нормами для {vehicleLabel}.
          Пробег на датах без заказ-наряда оценивается по соседним точкам.
        </p>
        <p className="mt-2">
          <strong className="text-slate-800">Раньше нормы</strong> — износный узел заменён
          заметно раньше регламента.{' '}
          <strong className="text-slate-800">Чаще регламента</strong> — плановое ТО
          (масло, фильтры). <strong className="text-slate-800">Дубль</strong> — чек и работа
          в один визит.
        </p>
      </section>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Подозрительный износ"
          value={String(earlyWear.length)}
          subtitle="Шаровые, ступицы, подвеска..."
        />
        <KpiCard
          title="Чаще регламента"
          value={String(earlyPlanned.length)}
          subtitle="Масло и фильтры"
        />
        <KpiCard
          title="Дубли в данных"
          value={String(duplicates.length)}
          subtitle="Один визит, разные документы"
        />
      </div>

      {earlyWear.length > 0 && (
        <Accordion
          title="Подозрительные замены (износ)"
          subtitle={`${earlyWear.length} случаев`}
        >
          <div className="space-y-3">
            {earlyWear
              .sort((a, b) => (a.percentOfNorm ?? 100) - (b.percentOfNorm ?? 100))
              .map((comparison) => (
                <ComparisonCard
                  key={`wear-${comparison.current.date}-${comparison.label}`}
                  comparison={comparison}
                />
              ))}
          </div>
        </Accordion>
      )}

      {earlyPlanned.length > 0 && (
        <Accordion
          title="Чаще регламента (ТО)"
          subtitle={`${earlyPlanned.length} случаев`}
        >
          <div className="space-y-3">
            {earlyPlanned
              .sort((a, b) => (a.percentOfNorm ?? 100) - (b.percentOfNorm ?? 100))
              .map((comparison) => (
                <ComparisonCard
                  key={`planned-${comparison.current.date}-${comparison.label}`}
                  comparison={comparison}
                />
              ))}
          </div>
        </Accordion>
      )}

      {duplicates.length > 0 && (
        <Accordion
          title="Дубли в данных"
          subtitle={`${duplicates.length} случаев`}
        >
          <div className="space-y-3">
            {duplicates.map((comparison) => (
              <ComparisonCard
                key={`dup-${comparison.current.date}-${comparison.label}-${comparison.prev.date}`}
                comparison={comparison}
              />
            ))}
          </div>
        </Accordion>
      )}

      <Accordion
        title="Хронология по узлам"
        subtitle={`${timelines.length} типов запчастей`}
      >
        <div className="space-y-3">
          {timelines.map((timeline) => (
            <TimelineSection key={timeline.intervalId} timeline={timeline} />
          ))}
        </div>
      </Accordion>
    </div>
  )
}
