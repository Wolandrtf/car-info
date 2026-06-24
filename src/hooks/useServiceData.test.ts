import { describe, expect, it } from 'vitest'
import { filterVisits } from '../hooks/useServiceData'
import type { ServiceVisit } from '../types'

const visits: ServiceVisit[] = [
  {
    date: '2025-11-17',
    dateFormattedShort: '17.11.2025',
    organizations: ['ООО ТЕХНОСОЮЗ'],
    documents: [{ type: 'receipt', number: '1', date: '2025-11-17', supplier: 'ООО ТЕХНОСОЮЗ', inn: '1', total: 100, items: [] }],
    totalAmount: 100,
    parts: [
      {
        name: 'Масляный фильтр',
        category: 'filters',
        label: 'Масляный фильтр',
        quantity: 1,
        price: 300,
        source: 'receipt',
        organization: 'ООО ТЕХНОСОЮЗ',
        documentNumber: '1',
        date: '2025-11-17',
      },
    ],
    works: [],
  },
  {
    date: '2024-06-01',
    dateFormattedShort: '01.06.2024',
    organizations: ['ИП Иванов'],
    documents: [{ type: 'receipt', number: '2', date: '2024-06-01', supplier: 'ИП Иванов', inn: '2', total: 200, items: [] }],
    totalAmount: 200,
    parts: [],
    works: [{ name: 'Диагностика', price: 500, organization: 'ИП Иванов', documentNumber: '2' }],
  },
]

describe('filterVisits', () => {
  it('ищет по отформатированной дате', () => {
    const result = filterVisits(visits, '17.11.2025', '', '')
    expect(result).toHaveLength(1)
    expect(result[0].date).toBe('2025-11-17')
  })

  it('фильтрует по категории запчастей', () => {
    const result = filterVisits(visits, '', '', 'filters')
    expect(result).toHaveLength(1)
  })

  it('фильтрует по организации', () => {
    const result = filterVisits(visits, '', 'ИП Иванов', '')
    expect(result).toHaveLength(1)
  })
})
