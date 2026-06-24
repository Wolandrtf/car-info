import { describe, expect, it } from 'vitest'
import type { CarHistoryData } from '../types'
import { analyzeIntervals } from './intervalAnalysis'

function makeData(documents: CarHistoryData['documents']): CarHistoryData {
  return {
    source_file: 'test.txt',
    processed_date: '2026-01-01',
    vehicle_info: {
      make: 'TEST',
      model: 'Model',
      vin: 'VIN',
      year: 2020,
      license_plate: 'A000AA',
    },
    documents,
    summary: {
      total_documents: documents.length,
      total_receipts: documents.filter((doc) => doc.type === 'receipt').length,
      total_work_orders: documents.filter((doc) => doc.type === 'work_order').length,
      date_range: { from: '2020-01-01', to: '2025-01-01' },
    },
  }
}

describe('analyzeIntervals', () => {
  it('создаёт одно сравнение на пару последовательных замен', () => {
    const data = makeData([
      {
        type: 'work_order',
        number: '1',
        date: '2020-01-01',
        supplier: 'СТО',
        inn: '1',
        total: 1000,
        mileage: 50000,
        work_items: [{ name: 'Масло в ДВС, масляный фильтр, замена', price: 1000 }],
      },
      {
        type: 'work_order',
        number: '2',
        date: '2021-01-01',
        supplier: 'СТО',
        inn: '1',
        total: 1000,
        mileage: 65000,
        work_items: [{ name: 'Масло в ДВС, масляный фильтр, замена', price: 1000 }],
      },
    ])

    const result = analyzeIntervals(data)
    const oilTimeline = result.timelines.find((item) => item.intervalId === 'oil_change')

    expect(oilTimeline?.events).toHaveLength(2)
    expect(oilTimeline?.comparisons).toHaveLength(1)
    expect(oilTimeline?.comparisons[0].deltaKm).toBe(15000)
    expect(oilTimeline?.comparisons[0].current.date).toBe('2021-01-01')
  })
})
