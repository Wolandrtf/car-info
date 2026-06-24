import { isValid, parseISO } from 'date-fns'
import type { CarHistoryData, Document } from '../types'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0
}

function assertValidDate(dateStr: string, context: string): void {
  const date = parseISO(dateStr)
  if (!isValid(date)) {
    throw new Error(`Некорректная дата в ${context}: «${dateStr}»`)
  }
}

function validateDocument(document: unknown, index: number): asserts document is Document {
  if (!document || typeof document !== 'object') {
    throw new Error(`Документ #${index}: ожидается объект`)
  }

  const doc = document as Record<string, unknown>

  if (doc.type !== 'receipt' && doc.type !== 'work_order') {
    throw new Error(`Документ #${index}: неизвестный type «${String(doc.type)}»`)
  }

  if (!isNonEmptyString(doc.date)) {
    throw new Error(`Документ #${index}: отсутствует date`)
  }

  assertValidDate(doc.date, `документ #${index}`)

  if (!isNonEmptyString(doc.number) || !isNonEmptyString(doc.supplier) || !isNonEmptyString(doc.inn)) {
    throw new Error(`Документ #${index}: не заполнены number, supplier или inn`)
  }

  if (typeof doc.total !== 'number') {
    throw new Error(`Документ #${index}: total должен быть числом`)
  }
}

export function parseCarHistoryData(raw: unknown): CarHistoryData {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Данные истории: ожидается объект JSON')
  }

  const data = raw as Record<string, unknown>

  if (!data.vehicle_info || typeof data.vehicle_info !== 'object') {
    throw new Error('Данные истории: отсутствует vehicle_info')
  }

  const vehicle = data.vehicle_info as Record<string, unknown>
  for (const field of ['make', 'model', 'vin', 'license_plate'] as const) {
    if (!isNonEmptyString(vehicle[field])) {
      throw new Error(`Данные истории: vehicle_info.${field} не заполнен`)
    }
  }

  if (typeof vehicle.year !== 'number') {
    throw new Error('Данные истории: vehicle_info.year должен быть числом')
  }

  if (!Array.isArray(data.documents)) {
    throw new Error('Данные истории: documents должен быть массивом')
  }

  data.documents.forEach((document, index) => validateDocument(document, index))

  if (!data.summary || typeof data.summary !== 'object') {
    throw new Error('Данные истории: отсутствует summary')
  }

  const summary = data.summary as Record<string, unknown>
  const dateRange = summary.date_range

  if (!dateRange || typeof dateRange !== 'object') {
    throw new Error('Данные истории: отсутствует summary.date_range')
  }

  const range = dateRange as Record<string, unknown>
  if (!isNonEmptyString(range.from) || !isNonEmptyString(range.to)) {
    throw new Error('Данные истории: summary.date_range.from/to не заполнены')
  }

  assertValidDate(range.from, 'summary.date_range.from')
  assertValidDate(range.to, 'summary.date_range.to')

  return data as unknown as CarHistoryData
}
