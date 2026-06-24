import { describe, expect, it } from 'vitest'
import type { PartTypeTimeline } from './intervalAnalysis'
import { computeMaintenanceSchedule, getLatestMileage } from './maintenanceSchedule'
import type { ServiceVisit } from '../types'

const oilTimeline: PartTypeTimeline = {
  intervalId: 'oil_change',
  label: 'Масло ДВС + масляный фильтр',
  normKm: 12000,
  kind: 'planned',
  events: [
    {
      intervalId: 'oil_change',
      label: 'Масло ДВС + масляный фильтр',
      name: 'Масло в ДВС, замена',
      date: '2024-01-01',
      mileage: 180000,
      mileageEstimated: false,
      organization: 'СТО',
      documentNumber: '1',
    },
  ],
  comparisons: [],
}

describe('getLatestMileage', () => {
  it('возвращает пробег последнего визита с данными', () => {
    const visits: ServiceVisit[] = [
      {
        date: '2024-01-01',
        dateFormattedShort: '01.01.2024',
        organizations: ['СТО'],
        documents: [],
        totalAmount: 0,
        mileage: 180000,
        parts: [],
        works: [],
      },
      {
        date: '2025-01-01',
        dateFormattedShort: '01.01.2025',
        organizations: ['СТО'],
        documents: [],
        totalAmount: 0,
        mileage: 192000,
        parts: [],
        works: [],
      },
    ]

    expect(getLatestMileage(visits)).toBe(192000)
  })
})

describe('computeMaintenanceSchedule', () => {
  it('помечает просроченное ТО', () => {
    const result = computeMaintenanceSchedule([oilTimeline], 193000)
    const oil = result.items.find((item) => item.intervalId === 'oil_change')

    expect(oil?.status).toBe('overdue')
    expect(oil?.kmSinceLast).toBe(13000)
    expect(result.overdue.some((item) => item.intervalId === 'oil_change')).toBe(true)
  })

  it('помечает скорую замену', () => {
    const result = computeMaintenanceSchedule([oilTimeline], 191000)
    const oil = result.items.find((item) => item.intervalId === 'oil_change')

    expect(oil?.status).toBe('due_soon')
    expect(result.dueSoon).toHaveLength(1)
  })

  it('возвращает все узлы регламента', () => {
    const result = computeMaintenanceSchedule([oilTimeline], 190000)
    expect(result.items.length).toBeGreaterThan(20)
  })

  it('критичный узел без истории помечается просроченным при высоком пробеге', () => {
    const result = computeMaintenanceSchedule([], 190000)
    const belt = result.items.find((item) => item.intervalId === 'timing_belt')

    expect(belt?.status).toBe('overdue')
    expect(belt?.kind).toBe('critical')
  })
})
