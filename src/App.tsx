import { useMemo, useState } from 'react'
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

function App() {
  const data = useServiceData()
  const [activeTab, setActiveTab] = useState<TabId>('timeline')
  const [search, setSearch] = useState('')
  const [organization, setOrganization] = useState('')
  const [category, setCategory] = useState('')

  const filteredVisits = useMemo(
    () => filterVisits(data.visits, search, organization, category),
    [data.visits, search, organization, category],
  )

  const handleDateClick = (date: string) => {
    setActiveTab('timeline')
    setSearch(date)
    setOrganization('')
    setCategory('')
  }

  return (
    <AppLayout
      header={
        <VehicleHeader vehicle={data.vehicle} dateRange={data.summary.date_range} />
      }
      tabs={<TabNav activeTab={activeTab} onChange={setActiveTab} />}
    >
      {activeTab === 'timeline' && (
        <div className="space-y-4">
          <SearchFilter
            search={search}
            organization={organization}
            category={category}
            organizations={data.organizationsList}
            onSearchChange={setSearch}
            onOrganizationChange={setOrganization}
            onCategoryChange={setCategory}
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
          onDateClick={handleDateClick}
        />
      )}
    </AppLayout>
  )
}

export default App
