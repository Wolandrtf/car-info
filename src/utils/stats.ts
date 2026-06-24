import type {
  CarHistoryData,
  CategorySpending,
  MileagePoint,
  OrganizationStats,
  PartCategory,
  ServiceVisit,
  YearlySpending,
} from '../types'

export function getTotalSpending(visits: ServiceVisit[]): number {
  return visits.reduce((sum, visit) => sum + visit.totalAmount, 0)
}

export function getYearlySpending(visits: ServiceVisit[]): YearlySpending[] {
  const map = new Map<number, number>()

  for (const visit of visits) {
    const year = new Date(visit.date).getFullYear()
    map.set(year, (map.get(year) ?? 0) + visit.totalAmount)
  }

  return [...map.entries()]
    .map(([year, amount]) => ({ year, amount }))
    .sort((a, b) => a.year - b.year)
}

export function getMileagePoints(data: CarHistoryData): MileagePoint[] {
  return data.documents
    .filter((doc) => doc.type === 'work_order' && doc.mileage != null)
    .map((doc) => ({
      date: doc.date,
      mileage: (doc as { mileage: number }).mileage,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

export function getOrganizationStats(visits: ServiceVisit[]): OrganizationStats[] {
  const map = new Map<string, OrganizationStats>()

  for (const visit of visits) {
    for (const document of visit.documents) {
      const key = document.inn
      const existing = map.get(key)

      if (existing) {
        existing.totalAmount += document.total
        if (!existing.dates.includes(visit.date)) {
          existing.dates.push(visit.date)
          existing.visitCount += 1
        }
      } else {
        map.set(key, {
          name: document.supplier,
          inn: document.inn,
          visitCount: 1,
          totalAmount: document.total,
          dates: [visit.date],
        })
      }
    }
  }

  return [...map.values()]
    .map((org) => ({
      ...org,
      dates: [...org.dates].sort(
        (a, b) => new Date(b).getTime() - new Date(a).getTime(),
      ),
    }))
    .sort((a, b) => b.totalAmount - a.totalAmount)
}

export function getCategorySpending(visits: ServiceVisit[]): CategorySpending[] {
  const map = new Map<PartCategory, CategorySpending>()

  for (const visit of visits) {
    for (const part of visit.parts) {
      const amount = (part.price ?? 0) * part.quantity
      const existing = map.get(part.category)

      if (existing) {
        existing.amount += amount
        existing.count += 1
      } else {
        map.set(part.category, {
          category: part.category,
          amount,
          count: 1,
        })
      }
    }
  }

  return [...map.values()].sort((a, b) => b.amount - a.amount)
}
