import type { CarHistoryData, Document } from '../types'

export type IntervalKind = 'planned' | 'wear' | 'critical'

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
  recommendation: string
}

export const MAINTENANCE_INTERVALS: MaintenanceInterval[] = [
  {
    id: 'oil_change',
    label: 'Масло ДВС + масляный фильтр',
    normKm: 12000,
    kind: 'planned',
    keywords: ['масло в двс', 'масло двс', 'масляный фильтр'],
    recommendation: 'Каждые 10–15 тыс. км или 1 раз в год (что наступит раньше)',
  },
  {
    id: 'air_filter',
    label: 'Воздушный фильтр',
    normKm: 20000,
    kind: 'planned',
    keywords: ['воздушный фильтр', 'фильтр воздушный', 'a2801'],
    recommendation: 'Каждые 20 тыс. км',
  },
  {
    id: 'cabin_filter',
    label: 'Фильтр салона',
    normKm: 15000,
    kind: 'planned',
    keywords: ['фильтр вентиляции салона', 'фильтр салона', 'ac207', 'lac201', 'cu-1936'],
    recommendation: 'Каждые 15 тыс. км или 1 раз в год',
  },
  {
    id: 'spark_plugs',
    label: 'Свечи зажигания',
    normKm: 60000,
    kind: 'planned',
    keywords: ['свеч', 'свечи зажигания', 'свеча зажигания', 'ngk', 'denso', 'iridium'],
    recommendation: 'Каждые 60 тыс. км (иридиевые) или 30 тыс. км (обычные)',
  },
  {
    id: 'cvt_oil',
    label: 'Масло вариатора (CVT)',
    normKm: 45000,
    kind: 'critical',
    keywords: [
      'масло вариатор',
      'масло cvt',
      'cvt ns-2',
      'cvt ns2',
      'ns-2',
      'жидкость вариатора',
      'вариатор nissan',
    ],
    recommendation: 'Каждые 40–50 тыс. км — критично для ресурса CVT',
  },
  {
    id: 'timing_belt',
    label: 'Ремень ГРМ + ролики',
    normKm: 100000,
    kind: 'critical',
    keywords: [
      'ремень грм',
      'ремня грм',
      'грм',
      'газораспределительный механизм',
      'комплект грм',
      'ролик грм',
      'натяжитель грм',
    ],
    recommendation: 'Каждые 100 тыс. км или 5 лет — обрыв ремня губителен для двигателя',
  },
  {
    id: 'throttle_body',
    label: 'Дроссельная заслонка',
    normKm: 60000,
    kind: 'planned',
    keywords: ['дроссель', 'дроссельн', 'заслонк'],
    recommendation: 'Промывка/чистка каждые 60 тыс. км или при нестабильном холостом ходу',
  },
  {
    id: 'fuel_filter',
    label: 'Топливный фильтр',
    normKm: 60000,
    kind: 'planned',
    keywords: ['топливный фильтр', 'фильтр топливный', 'прокладка топливного фильтра'],
    recommendation: 'Каждые 60 тыс. км',
  },
  {
    id: 'coolant',
    label: 'Антифриз (замена)',
    normKm: 60000,
    kind: 'planned',
    keywords: ['антифриз - замена', 'антифриз замена', 'замена антифриз', 'охлаждающей жидкости'],
    recommendation: 'Каждые 60 тыс. км или раз в 3 года',
  },
  {
    id: 'brake_pads_front',
    label: 'Колодки передние',
    normKm: 40000,
    kind: 'wear',
    keywords: ['колодки торм. передние', 'колодки тормозные передние', 'колодки тормозные дисковые'],
    recommendation: 'По износу, ориентир 30–50 тыс. км',
  },
  {
    id: 'brake_pads_rear',
    label: 'Колодки задние',
    normKm: 50000,
    kind: 'wear',
    keywords: ['колодки торм. задние', 'колодки задние'],
    recommendation: 'По износу, ориентир 40–60 тыс. км',
  },
  {
    id: 'brake_discs',
    label: 'Тормозные диски',
    normKm: 80000,
    kind: 'wear',
    keywords: ['тормозной диск', 'диск тормоз', 'диски тормоз'],
    recommendation: 'По износу, ориентир 70–100 тыс. км или при замене колодок',
  },
  {
    id: 'cv_boot',
    label: 'ШРУС / пыльники',
    normKm: 80000,
    kind: 'wear',
    keywords: ['шрус', 'пыльник шрус', 'гранат шрус'],
    recommendation: 'Осмотр каждые 80 тыс. км, замена при трещинах пыльника',
  },
  {
    id: 'silent_block',
    label: 'Сайлентблоки',
    normKm: 80000,
    kind: 'wear',
    keywords: ['сайлентблок', 'сайлент-блок'],
    recommendation: 'По состоянию, ориентир 80–120 тыс. км',
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
    recommendation: 'По состоянию, ориентир 50–80 тыс. км',
  },
  {
    id: 'stabilizer_bush',
    label: 'Втулки стабилизатора',
    normKm: 60000,
    kind: 'wear',
    keywords: ['втулка стабилизатора', 'втулка заднего стабилизатора', 'втулка переднего стабилизатора'],
    recommendation: 'По состоянию, ориентир 60–80 тыс. км',
  },
  {
    id: 'shock_front',
    label: 'Амортизаторы передние',
    normKm: 80000,
    kind: 'wear',
    keywords: ['амортизатор передний', 'амортизаторы передней', 'dg11075', 'dg21075'],
    recommendation: 'По состоянию, ориентир 80–100 тыс. км',
  },
  {
    id: 'shock_rear',
    label: 'Амортизаторы задние',
    normKm: 80000,
    kind: 'wear',
    keywords: ['амортизатор задний', 'dg02181'],
    recommendation: 'По состоянию, ориентир 80–100 тыс. км',
  },
  {
    id: 'ball_joint',
    label: 'Шаровая опора',
    normKm: 80000,
    kind: 'wear',
    keywords: ['шаровая опора', 'sb-4942'],
    recommendation: 'По состоянию и люфтам, ориентир 80–120 тыс. км',
  },
  {
    id: 'hub_bearing',
    label: 'Ступица / подшипник',
    normKm: 100000,
    kind: 'wear',
    keywords: ['ступиц', 'подшипник передней', 'подшипник ступичный', 'wh1196', 'db83006'],
    recommendation: 'По шуму и люфту, ориентир 100–150 тыс. км',
  },
  {
    id: 'engine_mount',
    label: 'Опоры двигателя / КПП',
    normKm: 150000,
    kind: 'wear',
    keywords: ['опора двигателя', 'опора кпп', 'опора мотора', 'подушка двигателя'],
    recommendation: 'По состоянию, ориентир 150 тыс. км — возможны разрывы',
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
