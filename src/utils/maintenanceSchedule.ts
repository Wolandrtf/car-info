import type { ServiceVisit } from '../types'
import {
  MAINTENANCE_INTERVALS,
  type IntervalKind,
  type PartIntervalEvent,
  type PartTypeTimeline,
} from './intervalAnalysis'

export type MaintenanceStatus =
  | 'overdue'
  | 'due_soon'
  | 'ok'
  | 'no_history'
  | 'unknown_mileage'

export interface MaintenanceScheduleItem {
  intervalId: string
  label: string
  normKm: number
  kind: IntervalKind
  recommendation: string
  lastReplacement: PartIntervalEvent | null
  currentMileage: number | null
  kmSinceLast: number | null
  kmUntilDue: number | null
  nextDueMileage: number | null
  status: MaintenanceStatus
  statusNote: string
}

export interface MaintenanceScheduleResult {
  currentMileage: number | null
  items: MaintenanceScheduleItem[]
  overdue: MaintenanceScheduleItem[]
  dueSoon: MaintenanceScheduleItem[]
}

const DUE_SOON_RATIO = 0.85

const STATUS_ORDER: Record<MaintenanceStatus, number> = {
  overdue: 0,
  due_soon: 1,
  unknown_mileage: 2,
  ok: 3,
  no_history: 4,
}

export function getLatestMileage(visits: ServiceVisit[]): number | null {
  const latest = visits
    .filter((visit) => visit.mileage != null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

  return latest?.mileage ?? null
}

function resolveStatus(
  kmSinceLast: number | null,
  normKm: number,
  hasHistory: boolean,
  currentMileage: number | null,
  lastMileage: number | null,
  isCritical: boolean,
): { status: MaintenanceStatus; statusNote: string } {
  if (!hasHistory) {
    if (isCritical && currentMileage != null) {
      if (currentMileage >= normKm) {
        return {
          status: 'overdue',
          statusNote: 'Нет записи о замене — пробег авто превышает регламент, проверьте срочно',
        }
      }

      if (currentMileage >= normKm * DUE_SOON_RATIO) {
        return {
          status: 'due_soon',
          statusNote: 'Нет записи о замене — скоро предельный пробег, запланируйте проверку',
        }
      }
    }

    return {
      status: 'no_history',
      statusNote: 'Нет записей о замене в истории обслуживания',
    }
  }

  if (currentMileage == null) {
    return {
      status: 'unknown_mileage',
      statusNote: 'Нет актуального пробега — ориентируйтесь на регламент',
    }
  }

  if (lastMileage == null) {
    return {
      status: 'unknown_mileage',
      statusNote: 'Последняя замена без пробега — проверьте вручную',
    }
  }

  if (kmSinceLast == null) {
    return {
      status: 'unknown_mileage',
      statusNote: 'Недостаточно данных для расчёта',
    }
  }

  if (kmSinceLast >= normKm) {
    const overBy = kmSinceLast - normKm
    return {
      status: 'overdue',
      statusNote:
        overBy > 0
          ? `Просрочено на ${overBy.toLocaleString('ru-RU')} км`
          : 'Пора менять по регламенту',
    }
  }

  if (kmSinceLast >= normKm * DUE_SOON_RATIO) {
    return {
      status: 'due_soon',
      statusNote: 'Скоро по регламенту — планируйте замену',
    }
  }

  return {
    status: 'ok',
    statusNote: 'В пределах регламента',
  }
}

export function computeMaintenanceSchedule(
  timelines: PartTypeTimeline[],
  currentMileage: number | null,
): MaintenanceScheduleResult {
  const timelineMap = new Map(timelines.map((timeline) => [timeline.intervalId, timeline]))

  const items = MAINTENANCE_INTERVALS.map((interval) => {
    const timeline = timelineMap.get(interval.id)
    const events = timeline?.events ?? []
    const lastReplacement = events.length > 0 ? events[events.length - 1] : null
    const lastMileage = lastReplacement?.mileage ?? null

    const kmSinceLast =
      currentMileage != null && lastMileage != null ? currentMileage - lastMileage : null

    const kmUntilDue = kmSinceLast != null ? interval.normKm - kmSinceLast : null
    const nextDueMileage = lastMileage != null ? lastMileage + interval.normKm : null

    const { status, statusNote } = resolveStatus(
      kmSinceLast,
      interval.normKm,
      lastReplacement != null,
      currentMileage,
      lastMileage,
      interval.kind === 'critical',
    )

    return {
      intervalId: interval.id,
      label: interval.label,
      normKm: interval.normKm,
      kind: interval.kind,
      recommendation: interval.recommendation,
      lastReplacement,
      currentMileage,
      kmSinceLast,
      kmUntilDue,
      nextDueMileage,
      status,
      statusNote,
    }
  }).sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    if (byStatus !== 0) return byStatus

    const aDue = a.kmUntilDue ?? Number.POSITIVE_INFINITY
    const bDue = b.kmUntilDue ?? Number.POSITIVE_INFINITY
    return aDue - bDue
  })

  return {
    currentMileage,
    items,
    overdue: items.filter((item) => item.status === 'overdue'),
    dueSoon: items.filter((item) => item.status === 'due_soon'),
  }
}
