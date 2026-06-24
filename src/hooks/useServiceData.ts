import { useMemo } from 'react'
import carHistory from '../data/src.json'
import type { CarHistoryData, PartReplacementHistory, ServiceVisit } from '../types'
import { buildPartHistory, groupDocumentsByDate } from '../utils/groupByDate'
import { analyzeIntervals } from '../utils/intervalAnalysis'
import {
  getCategorySpending,
  getMileageEntries,
  getOrganizationStats,
  getTotalSpending,
  getYearlySpending,
} from '../utils/stats'

const data = carHistory as CarHistoryData

export function useServiceData() {
  const visits = useMemo(() => groupDocumentsByDate(data), [])
  const partHistory = useMemo(() => buildPartHistory(visits), [visits])
  const organizations = useMemo(() => getOrganizationStats(visits), [visits])
  const yearlySpending = useMemo(() => getYearlySpending(visits), [visits])
  const mileageEntries = useMemo(() => getMileageEntries(visits), [visits])
  const categorySpending = useMemo(() => getCategorySpending(visits), [visits])
  const totalSpending = useMemo(() => getTotalSpending(visits), [visits])
  const intervalAnalysis = useMemo(() => analyzeIntervals(data), [])

  const organizationsList = useMemo(
    () => [...new Set(visits.flatMap((visit) => visit.organizations))].sort(),
    [visits],
  )

  return {
    vehicle: {
      make: data.vehicle_info.make,
      model: data.vehicle_info.model,
      vin: data.vehicle_info.vin,
      year: data.vehicle_info.year,
      license_plate: data.vehicle_info.license_plate,
    },
    summary: data.summary,
    visits,
    partHistory,
    organizations,
    yearlySpending,
    mileageEntries,
    categorySpending,
    totalSpending,
    organizationsList,
    intervalAnalysis,
  }
}

export type ServiceData = ReturnType<typeof useServiceData>

export function filterVisits(
  visits: ServiceVisit[],
  search: string,
  organization: string,
  category: string,
): ServiceVisit[] {
  const query = search.trim().toLowerCase()

  return visits.filter((visit) => {
    const matchesOrganization =
      !organization || visit.organizations.includes(organization)

    const matchesCategory =
      !category || visit.parts.some((part) => part.category === category)

    const matchesSearch =
      !query ||
      visit.date === query ||
      visit.date.includes(query) ||
      visit.organizations.some((org) => org.toLowerCase().includes(query)) ||
      visit.works.some((work) => work.name.toLowerCase().includes(query)) ||
      visit.parts.some((part) => part.name.toLowerCase().includes(query)) ||
      visit.documents.some((doc) => doc.number.toLowerCase().includes(query))

    return matchesOrganization && matchesCategory && matchesSearch
  })
}

export function groupPartHistoryByCategory(
  partHistory: PartReplacementHistory[],
): Map<string, PartReplacementHistory[]> {
  const map = new Map<string, PartReplacementHistory[]>()

  for (const item of partHistory) {
    const existing = map.get(item.category) ?? []
    existing.push(item)
    map.set(item.category, existing)
  }

  return map
}
