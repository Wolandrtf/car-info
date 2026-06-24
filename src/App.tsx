import { useEffect, useMemo, useState } from 'react'
import { AppLayout } from './components/layout/AppLayout'
import { TabNav } from './components/layout/TabNav'
import { IntervalAnalysisView } from './components/IntervalAnalysisView'
import { OrganizationsView } from './components/OrganizationsView'
import { PartsByCategory } from './components/PartsByCategory'
import { SearchFilter } from './components/SearchFilter'
import { SummaryDashboard } from './components/SummaryDashboard'
import { Timeline } from './components/Timeline'
import { VehicleHeader } from './components/VehicleHeader'
import { filterVisits, useServiceData } from './hooks/useServiceData'
import type { TabId } from './types'
import { formatDateShort } from './utils/formatters'

function App() {
  const data = useServiceData()
  const [activeTab, setActiveTab] = useState<TabId>('timeline')
  const [search, setSearch] = useState('')
  const [organization, setOrganization] = useState('')
  const [category, setCategory] = useState('')
  const [selectedVisitDate, setSelectedVisitDate] = useState<string | null>(null)

  const visitsBeforeDateFilter = useMemo(
    () => filterVisits(data.visits, search, organization, category),
    [data.visits, search, organization, category],
  )

  const filteredVisits = useMemo(() => {
    if (!selectedVisitDate) return visitsBeforeDateFilter
    return visitsBeforeDateFilter.filter((visit) => visit.date === selectedVisitDate)
  }, [visitsBeforeDateFilter, selectedVisitDate])

  useEffect(() => {
    if (
      selectedVisitDate &&
      !visitsBeforeDateFilter.some((visit) => visit.date === selectedVisitDate)
    ) {
      setSelectedVisitDate(null)
    }
  }, [selectedVisitDate, visitsBeforeDateFilter])

  const handleDateClick = (date: string) => {
    setActiveTab('timeline')
    setSelectedVisitDate(date)
    setSearch('')
    setOrganization('')
    setCategory('')
  }

  const clearVisitDateFilter = () => setSelectedVisitDate(null)

  const showVisitDateBanner =
    selectedVisitDate != null &&
    filteredVisits.some((visit) => visit.date === selectedVisitDate)

  return (
    <AppLayout
      header={
        <VehicleHeader vehicle={data.vehicle} dateRange={data.summary.date_range} />
      }
      tabs={<TabNav activeTab={activeTab} onChange={setActiveTab} />}
    >
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          {showVisitDateBanner && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
              <span className="text-slate-800">
                Показан визит от{' '}
                <strong className="font-semibold text-slate-900">
                  {formatDateShort(selectedVisitDate!)}
                </strong>
              </span>
              <button
                type="button"
                onClick={clearVisitDateFilter}
                className="rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-primary shadow-sm ring-1 ring-primary/20 hover:bg-primary/5"
              >
                Показать все
              </button>
            </div>
          )}
          <SearchFilter
            search={search}
            organization={organization}
            category={category}
            organizations={data.organizationsList}
            onSearchChange={(value) => {
              setSearch(value)
              setSelectedVisitDate(null)
            }}
            onOrganizationChange={(value) => {
              setOrganization(value)
              setSelectedVisitDate(null)
            }}
            onCategoryChange={(value) => {
              setCategory(value)
              setSelectedVisitDate(null)
            }}
          />
          <Timeline visits={filteredVisits} />
        </div>
      )}

      {activeTab === 'parts' && <PartsByCategory partHistory={data.partHistory} />}

      {activeTab === 'organizations' && (
        <OrganizationsView
          organizations={data.organizations}
          onDateClick={handleDateClick}
        />
      )}

      {activeTab === 'intervals' && (
        <IntervalAnalysisView
          vehicleLabel={data.vehicle.make}
          timelines={data.intervalAnalysis.timelines}
          earlyWear={data.intervalAnalysis.earlyWear}
          earlyPlanned={data.intervalAnalysis.earlyPlanned}
          duplicates={data.intervalAnalysis.duplicates}
        />
      )}

      {activeTab === 'summary' && (
        <SummaryDashboard
          visitCount={data.visits.length}
          totalSpending={data.totalSpending}
          dateRange={data.summary.date_range}
          yearlySpending={data.yearlySpending}
          mileageEntries={data.mileageEntries}
          categorySpending={data.categorySpending}
          partsWithoutPriceCount={data.partsWithoutPriceCount}
          onDateClick={handleDateClick}
        />
      )}
    </AppLayout>
  )
}

export default App
