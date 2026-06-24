import { categorizePart, getPartLabel } from './categorizeParts'
import { formatDateShort } from './formatters'
import type {
  CarHistoryData,
  Document,
  PartReplacementHistory,
  ServiceVisit,
  UnifiedPart,
  UnifiedWork,
} from '../types'

function extractPartsFromDocument(document: Document): UnifiedPart[] {
  if (document.type === 'receipt') {
    return document.items.map((item) => {
      const category = categorizePart(item.name)
      return {
        name: item.name,
        category,
        label: getPartLabel(item.name, category),
        quantity: item.quantity,
        price: item.price,
        source: 'receipt' as const,
        organization: document.supplier,
        documentNumber: document.number,
        date: document.date,
      }
    })
  }

  return (document.parts ?? []).map((part) => {
    const category = categorizePart(part.name)
    return {
      name: part.name,
      category,
      label: getPartLabel(part.name, category),
      quantity: part.quantity ?? 1,
      price: part.price,
      source: 'work_order' as const,
      organization: document.supplier,
      documentNumber: document.number,
      date: document.date,
    }
  })
}

function extractWorksFromDocument(document: Document): UnifiedWork[] {
  if (document.type !== 'work_order') return []

  return document.work_items.map((item) => ({
    name: item.name,
    price: item.price,
    total: item.total,
    discount: item.discount,
    executors: item.executors,
    organization: document.supplier,
    documentNumber: document.number,
  }))
}

export function groupDocumentsByDate(data: CarHistoryData): ServiceVisit[] {
  const visitsMap = new Map<string, ServiceVisit>()

  for (const document of data.documents) {
    const existing = visitsMap.get(document.date)

    if (existing) {
      existing.documents.push(document)
      existing.organizations = [...new Set([...existing.organizations, document.supplier])]
      existing.totalAmount += document.total
      existing.parts.push(...extractPartsFromDocument(document))
      existing.works.push(...extractWorksFromDocument(document))

      if (document.type === 'work_order' && document.mileage) {
        existing.mileage = Math.max(existing.mileage ?? 0, document.mileage)
      }
    } else {
      visitsMap.set(document.date, {
        date: document.date,
        dateFormattedShort: formatDateShort(document.date),
        organizations: [document.supplier],
        documents: [document],
        totalAmount: document.total,
        mileage: document.type === 'work_order' ? document.mileage : undefined,
        parts: extractPartsFromDocument(document),
        works: extractWorksFromDocument(document),
      })
    }
  }

  return [...visitsMap.values()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
}

export function buildPartHistory(visits: ServiceVisit[]): PartReplacementHistory[] {
  const historyMap = new Map<string, PartReplacementHistory>()

  for (const visit of visits) {
    for (const part of visit.parts) {
      const key = `${part.category}::${part.label}`
      const existing = historyMap.get(key)

      if (existing) {
        existing.events.push(part)
      } else {
        historyMap.set(key, {
          category: part.category,
          label: part.label,
          events: [part],
        })
      }
    }
  }

  return [...historyMap.values()]
    .map((group) => ({
      ...group,
      events: [...group.events].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, 'ru'))
}
