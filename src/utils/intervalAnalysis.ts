import type { CarHistoryData, Document } from '../types'

export type IntervalKind = 'planned' | 'wear'

export type IntervalVerdict =
  | 'early_wear'
  | 'early_planned'
  | 'duplicate'
  | 'ok'
  | 'unknown'

export interface MaintenanceInterval {
  id: string
  label: string
  normKm: number
  kind: IntervalKind
  keywords: string[]
}

export const MAINTENANCE_INTERVALS: MaintenanceInterval[] = [
  {
    id: 'oil_change',
    label: 'Масло ДВС + масляный фильтр',
    normKm: 12000,
    kind: 'planned',
    keywords: ['масло в двс', 'масло двс', 'масляный фильтр'],
  },
  {
    id: 'air_filter',
    label: 'Воздушный фильтр',
    normKm: 20000,
    kind: 'planned',
    keywords: ['воздушный фильтр', 'фильтр воздушный', 'a2801'],
  },
  {
    id: 'cabin_filter',
    label: 'Фильтр салона',
    normKm: 15000,
    kind: 'planned',
    keywords: ['фильтр вентиляции салона', 'фильтр салона', 'ac207', 'lac201', 'cu-1936'],
  },
  {
    id: 'brake_pads_front',
    label: 'Колодки передние',
    normKm: 40000,
    kind: 'wear',
    keywords: ['колодки торм. передние', 'колодки тормозные передние', 'колодки тормозные дисковые'],
  },
  {
    id: 'brake_pads_rear',
    label: 'Колодки задние',
    normKm: 50000,
    kind: 'wear',
    keywords: ['колодки торм. задние', 'колодки задние'],
  },
  {
    id: 'stabilizer_link',
    label: 'Стойки стабилизатора',
    normKm: 50000,
    kind: 'wear',
    keywords: [
      'стойка переднего стабилизатора',
      'стойка стабилизатора',
      'тяга/стойка стабилизатора',
      'clo460',
    ],
  },
  {
    id: 'stabilizer_bush',
    label: 'Втулки стабилизатора',
    normKm: 60000,
    kind: 'wear',
    keywords: ['втулка стабилизатора', 'втулка заднего стабилизатора', 'втулка переднего стабилизатора'],
  },
  {
    id: 'shock_front',
    label: 'Амортизаторы передние',
    normKm: 80000,
    kind: 'wear',
    keywords: ['амортизатор передний', 'амортизаторы передней', 'dg11075', 'dg21075'],
  },
  {
    id: 'shock_rear',
    label: 'Амортизаторы задние',
    normKm: 80000,
    kind: 'wear',
    keywords: ['амортизатор задний', 'dg02181'],
  },
  {
    id: 'ball_joint',
    label: 'Шаровая опора',
    normKm: 80000,
    kind: 'wear',
    keywords: ['шаровая опора', 'sb-4942'],
  },
  {
    id: 'hub_bearing',
    label: 'Ступица / подшипник',
    normKm: 100000,
    kind: 'wear',
    keywords: ['ступиц', 'подшипник передней', 'подшипник ступичный', 'wh1196', 'db83006'],
  },
]

export interface PartIntervalEvent {
  intervalId: string
  label: string
  name: string
  date: string
  mileage: number | null
  mileageEstimated: boolean
  organization: string
  documentNumber: string
}

export interface IntervalComparison {
  intervalId: string
  label: string
  normKm: number
  kind: IntervalKind
  prev: PartIntervalEvent
  current: PartIntervalEvent
  deltaKm: number | null
  deltaDays: number
  percentOfNorm: number | null
  verdict: IntervalVerdict
  note: string
}

export interface PartTypeTimeline {
  intervalId: string
  label: string
  normKm: number
  kind: IntervalKind
  events: PartIntervalEvent[]
  comparisons: IntervalComparison[]
}

export interface IntervalAnalysisResult {
  timelines: PartTypeTimeline[]
  earlyWear: IntervalComparison[]
  earlyPlanned: IntervalComparison[]
  duplicates: IntervalComparison[]
}

const DUPLICATE_MAX_KM = 500
const DUPLICATE_MAX_DAYS = 7
const EARLY_THRESHOLD = 0.85
const MIN_REAL_KM = 1000

function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е')
}

function buildMileageAnchors(data: CarHistoryData): Map<string, number> {
  const map = new Map<string, number>()

  for (const document of data.documents) {
    if (document.type === 'work_order' && document.mileage != null) {
      map.set(document.date, Math.max(map.get(document.date) ?? 0, document.mileage))
    }
  }

  return map
}

function estimateMileage(date: string, anchors: Array<{ date: string; mileage: number }>): {
  mileage: number | null
  estimated: boolean
} {
  const exact = anchors.find((anchor) => anchor.date === date)
  if (exact) return { mileage: exact.mileage, estimated: false }

  const target = new Date(date).getTime()
  let before: { date: string; mileage: number } | null = null
  let after: { date: string; mileage: number } | null = null

  for (const anchor of anchors) {
    const anchorTime = new Date(anchor.date).getTime()
    if (anchorTime <= target) before = anchor
    if (anchorTime >= target && !after) after = anchor
  }

  if (before && after && before.date !== after.date) {
    const ratio =
      (target - new Date(before.date).getTime()) /
      (new Date(after.date).getTime() - new Date(before.date).getTime())
    return {
      mileage: Math.round(before.mileage + ratio * (after.mileage - before.mileage)),
      estimated: true,
    }
  }

  if (before) return { mileage: before.mileage, estimated: true }
  if (after) return { mileage: after.mileage, estimated: true }
  return { mileage: null, estimated: true }
}

function matchIntervalIds(text: string): string[] {
  const normalized = normalize(text)
  return MAINTENANCE_INTERVALS.filter((interval) =>
    interval.keywords.some((keyword) => normalized.includes(keyword)),
  ).map((interval) => interval.id)
}

function extractTexts(document: Document): string[] {
  if (document.type === 'receipt') {
    return document.items.map((item) => item.name)
  }

  return [
    ...document.work_items.map((item) => item.name),
    ...(document.parts ?? []).map((part) => part.name),
  ]
}

function dedupeEvents(events: PartIntervalEvent[]): PartIntervalEvent[] {
  const byDate = new Map<string, PartIntervalEvent>()

  for (const event of events) {
    const existing = byDate.get(event.date)
    if (!existing) {
      byDate.set(event.date, event)
      continue
    }

    if (existing.mileage == null && event.mileage != null) {
      byDate.set(event.date, event)
    }
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date))
}

function getVerdict(
  interval: MaintenanceInterval,
  deltaKm: number | null,
  deltaDays: number,
): { verdict: IntervalVerdict; note: string; percentOfNorm: number | null } {
  if (deltaKm == null) {
    return {
      verdict: 'unknown',
      note: 'Недостаточно данных о пробеге',
      percentOfNorm: null,
    }
  }

  if (deltaKm <= DUPLICATE_MAX_KM && deltaDays <= DUPLICATE_MAX_DAYS) {
    return {
      verdict: 'duplicate',
      note: 'Вероятно один визит: чек и заказ-наряд в соседние дни',
      percentOfNorm: Math.round((deltaKm / interval.normKm) * 100),
    }
  }

  const percentOfNorm = Math.round((deltaKm / interval.normKm) * 100)

  if (deltaKm >= interval.normKm * EARLY_THRESHOLD) {
    return {
      verdict: 'ok',
      note: 'Интервал в пределах нормы',
      percentOfNorm,
    }
  }

  if (interval.kind === 'planned') {
    return {
      verdict: 'early_planned',
      note: 'Замена чаще регламента — вероятно плановое ТО',
      percentOfNorm,
    }
  }

  if (deltaKm < MIN_REAL_KM) {
    return {
      verdict: 'duplicate',
      note: 'Слишком малый пробег между записями — возможен дубль в данных',
      percentOfNorm,
    }
  }

  return {
    verdict: 'early_wear',
    note: 'Замена раньше нормы — возможен износ или дефект',
    percentOfNorm,
  }
}

function buildComparisons(
  interval: MaintenanceInterval,
  events: PartIntervalEvent[],
): IntervalComparison[] {
  const comparisons: IntervalComparison[] = []

  for (let index = 1; index < events.length; index += 1) {
    const prev = events[index - 1]
    const current = events[index]
    const deltaKm =
      prev.mileage != null && current.mileage != null
        ? current.mileage - prev.mileage
        : null
    const deltaDays = Math.round(
      (new Date(current.date).getTime() - new Date(prev.date).getTime()) / 86_400_000,
    )
    const { verdict, note, percentOfNorm } = getVerdict(interval, deltaKm, deltaDays)

    comparisons.push({
      intervalId: interval.id,
      label: interval.label,
      normKm: interval.normKm,
      kind: interval.kind,
      prev,
      current,
      deltaKm,
      deltaDays,
      percentOfNorm,
      verdict,
      note,
    })
  }

  return comparisons
}

export function analyzeIntervals(data: CarHistoryData): IntervalAnalysisResult {
  const anchorMap = buildMileageAnchors(data)
  const anchors = [...anchorMap.entries()]
    .map(([date, mileage]) => ({ date, mileage }))
    .sort((a, b) => a.date.localeCompare(b.date))

  const eventsByInterval = new Map<string, PartIntervalEvent[]>()

  for (const document of data.documents) {
    const mileageInfo =
      document.type === 'work_order' && document.mileage != null
        ? { mileage: document.mileage, estimated: false }
        : estimateMileage(document.date, anchors)

    for (const text of extractTexts(document)) {
      for (const intervalId of matchIntervalIds(text)) {
        const interval = MAINTENANCE_INTERVALS.find((item) => item.id === intervalId)
        if (!interval) continue

        const events = eventsByInterval.get(intervalId) ?? []
        events.push({
          intervalId,
          label: interval.label,
          name: text,
          date: document.date,
          mileage: mileageInfo.mileage,
          mileageEstimated: mileageInfo.estimated,
          organization: document.supplier,
          documentNumber: document.number,
        })
        eventsByInterval.set(intervalId, events)
      }
    }
  }

  const timelines: PartTypeTimeline[] = MAINTENANCE_INTERVALS.map((interval) => {
    const events = dedupeEvents(eventsByInterval.get(interval.id) ?? [])
    const comparisons = buildComparisons(interval, events)
    return {
      intervalId: interval.id,
      label: interval.label,
      normKm: interval.normKm,
      kind: interval.kind,
      events,
      comparisons,
    }
  }).filter((timeline) => timeline.events.length > 0)

  const allComparisons = timelines.flatMap((timeline) => timeline.comparisons)

  return {
    timelines,
    earlyWear: allComparisons.filter((item) => item.verdict === 'early_wear'),
    earlyPlanned: allComparisons.filter((item) => item.verdict === 'early_planned'),
    duplicates: allComparisons.filter((item) => item.verdict === 'duplicate'),
  }
}
