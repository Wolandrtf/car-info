import { describe, expect, it } from 'vitest'
import type { ServiceVisit, UnifiedPart } from '../types'
import { countPartsWithoutPrice, getCategorySpending } from './stats'

function visit(parts: UnifiedPart[]): ServiceVisit {
  return {
    date: '2025-01-01',
    dateFormattedShort: '01.01.2025',
    organizations: ['СТО'],
    documents: [],
    totalAmount: 0,
    parts,
    works: [],
  }
}

describe('getCategorySpending', () => {
  it('считает чек как сумму строки без умножения на quantity', () => {
    const result = getCategorySpending([
      visit([
        {
          name: 'Фильтр',
          category: 'filters',
          label: 'Фильтр',
          quantity: 2,
          price: 500,
          source: 'receipt',
          organization: 'СТО',
          documentNumber: '1',
          date: '2025-01-01',
        },
      ]),
    ])

    expect(result).toEqual([{ category: 'filters', amount: 500, count: 1 }])
  })
})

describe('countPartsWithoutPrice', () => {
  it('считает позиции с price = null', () => {
    expect(
      countPartsWithoutPrice([
        visit([
          {
            name: 'A',
            category: 'other',
            label: 'Прочее',
            quantity: 1,
            price: null,
            source: 'receipt',
            organization: 'СТО',
            documentNumber: '1',
            date: '2025-01-01',
          },
          {
            name: 'B',
            category: 'other',
            label: 'Прочее',
            quantity: 1,
            price: 100,
            source: 'receipt',
            organization: 'СТО',
            documentNumber: '1',
            date: '2025-01-01',
          },
        ]),
      ]),
    ).toBe(1)
  })
})
