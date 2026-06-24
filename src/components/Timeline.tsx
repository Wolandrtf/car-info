import type { ServiceVisit } from '../types'
import { VisitCard } from './VisitCard'

interface TimelineProps {
  visits: ServiceVisit[]
}

export function Timeline({ visits }: TimelineProps) {
  if (visits.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-card p-8 text-center text-muted">
        По выбранным фильтрам визиты не найдены.
      </div>
    )
  }

  return (
    <div className="relative space-y-6 md:border-l-2 md:border-slate-200 md:pl-8">
      {visits.map((visit) => (
        <VisitCard key={visit.date} visit={visit} />
      ))}
    </div>
  )
}
