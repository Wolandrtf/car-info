import type { TabId } from '../../types'
import { cn } from '../../utils/cn'

interface TabNavProps {
  activeTab: TabId
  onChange: (tab: TabId) => void
}

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'timeline', label: 'Таймлайн' },
  { id: 'parts', label: 'Запчасти' },
  { id: 'organizations', label: 'Организации' },
  { id: 'intervals', label: 'Интервалы' },
  { id: 'summary', label: 'Сводка' },
]

export function TabNav({ activeTab, onChange }: TabNavProps) {
  return (
    <div className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            'rounded-md px-3 py-2 text-sm font-medium transition-colors',
            activeTab === tab.id
              ? 'bg-white text-primary shadow'
              : 'text-slate-600 hover:text-slate-900',
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
