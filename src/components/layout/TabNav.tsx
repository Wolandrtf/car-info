import { useId, type KeyboardEvent } from 'react'
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
  { id: 'schedule', label: 'Регламент' },
  { id: 'intervals', label: 'Интервалы' },
  { id: 'summary', label: 'Сводка' },
]

export function TabNav({ activeTab, onChange }: TabNavProps) {
  const tabListId = useId()

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null

    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % TABS.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + TABS.length) % TABS.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = TABS.length - 1
    }

    if (nextIndex != null) {
      event.preventDefault()
      onChange(TABS[nextIndex].id)
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Разделы приложения"
      id={tabListId}
      className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1"
    >
      {TABS.map((tab, index) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          id={`${tabListId}-${tab.id}`}
          aria-selected={activeTab === tab.id}
          aria-controls={`panel-${tab.id}`}
          tabIndex={activeTab === tab.id ? 0 : -1}
          onClick={() => onChange(tab.id)}
          onKeyDown={(event) => handleKeyDown(event, index)}
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
