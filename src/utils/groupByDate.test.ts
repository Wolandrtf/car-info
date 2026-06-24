import { describe, expect, it } from 'vitest'
import type { CarHistoryData } from '../types'
import { groupDocumentsByDate } from './groupByDate'

const sampleData: CarHistoryData = {
  source_file: 'test.txt',
  processed_date: '2026-01-01',
  vehicle_info: {
    make: 'TEST',
    model: 'Model',
    vin: 'VIN123',
    year: 2020,
    license_plate: 'A000AA',
  },
  documents: [
    {
      type: 'receipt',
      number: '1',
      date: '2025-01-15',
      supplier: 'СТО А',
      inn: '111',
      total: 1000,
      items: [{ name: 'Фильтр', quantity: 1, price: 1000 }],
    },
    {
      type: 'work_order',
      number: '2',
      date: '2025-01-15',
      supplier: 'СТО Б',
      inn: '222',
      total: 500,
      mileage: 100000,
      work_items: [{ name: 'Замена масла', price: 500 }],
    },
    {
      type: 'receipt',
      number: '3',
      date: '2024-06-01',
      supplier: 'СТО А',
      inn: '111',
      total: 200,
      items: [{ name: 'Лампа', quantity: 1, price: 200 }],
    },
  ],
  summary: {
    total_documents: 3,
    total_receipts: 2,
    total_work_orders: 1,
    date_range: { from: '2024-06-01', to: '2025-01-15' },
  },
}

describe('groupDocumentsByDate', () => {
  it('группирует документы по дате и сортирует по убыванию', () => {
    const visits = groupDocumentsByDate(sampleData)
    expect(visits).toHaveLength(2)
    expect(visits[0].date).toBe('2025-01-15')
    expect(visits[0].documents).toHaveLength(2)
    expect(visits[0].organizations).toEqual(expect.arrayContaining(['СТО А', 'СТО Б']))
  })

  it('добавляет dateFormattedShort', () => {
    const visits = groupDocumentsByDate(sampleData)
    expect(visits[0].dateFormattedShort).toBe('15.01.2025')
  })

  it('берёт максимальный пробег за день', () => {
    const visits = groupDocumentsByDate(sampleData)
    expect(visits[0].mileage).toBe(100000)
  })
})
