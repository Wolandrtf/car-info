import { describe, expect, it } from 'vitest'
import { parseCarHistoryData } from './validateData'

const validData = {
  source_file: 'car.txt',
  processed_date: '2026-01-01',
  vehicle_info: {
    make: 'TEST',
    model: 'Model',
    vin: 'VIN123456789',
    year: 2020,
    license_plate: 'A000AA',
  },
  documents: [
    {
      type: 'receipt',
      number: '1',
      date: '2025-01-01',
      supplier: 'СТО',
      inn: '123',
      total: 100,
      items: [],
    },
  ],
  summary: {
    total_documents: 1,
    total_receipts: 1,
    total_work_orders: 0,
    date_range: { from: '2025-01-01', to: '2025-01-01' },
  },
}

describe('parseCarHistoryData', () => {
  it('принимает корректные данные', () => {
    expect(parseCarHistoryData(validData).vehicle_info.make).toBe('TEST')
  })

  it('отклоняет некорректную дату', () => {
    expect(() =>
      parseCarHistoryData({
        ...validData,
        documents: [{ ...validData.documents[0], date: 'не-дата' }],
      }),
    ).toThrow(/Некорректная дата/)
  })

  it('отклоняет отсутствие vehicle_info', () => {
    expect(() => parseCarHistoryData({ ...validData, vehicle_info: undefined })).toThrow(
      /vehicle_info/,
    )
  })
})
