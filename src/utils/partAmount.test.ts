import { describe, expect, it } from 'vitest'
import type { UnifiedPart } from '../types'
import { getPartLineAmount } from './partAmount'

function part(overrides: Partial<UnifiedPart>): UnifiedPart {
  return {
    name: 'Тест',
    category: 'filters',
    label: 'Фильтр',
    quantity: 2,
    price: 100,
    source: 'receipt',
    organization: 'СТО',
    documentNumber: '1',
    date: '2025-01-01',
    ...overrides,
  }
}

describe('getPartLineAmount', () => {
  it('в чеке price — сумма строки, quantity не умножается', () => {
    expect(getPartLineAmount(part({ source: 'receipt', price: 2700, quantity: 2 }))).toBe(2700)
  })

  it('в заказ-наряде price умножается на quantity', () => {
    expect(getPartLineAmount(part({ source: 'work_order', price: 100, quantity: 3 }))).toBe(300)
  })

  it('возвращает 0 при price = null', () => {
    expect(getPartLineAmount(part({ price: null }))).toBe(0)
  })
})
