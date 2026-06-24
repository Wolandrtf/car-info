import type { PartCategory } from '../types'
import { CATEGORY_LABELS } from '../constants/categoryColors'

interface SearchFilterProps {
  search: string
  organization: string
  category: string
  organizations: string[]
  onSearchChange: (value: string) => void
  onOrganizationChange: (value: string) => void
  onCategoryChange: (value: string) => void
}

const CATEGORIES = Object.entries(CATEGORY_LABELS) as Array<[PartCategory, string]>

export function SearchFilter({
  search,
  organization,
  category,
  organizations,
  onSearchChange,
  onOrganizationChange,
  onCategoryChange,
}: SearchFilterProps) {
  return (
    <div className="grid gap-3 rounded-xl border border-slate-200 bg-card p-4 shadow-sm md:grid-cols-3">
      <label className="block">
        <span className="mb-1 block text-sm text-muted">Поиск</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Работа, запчасть, документ..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-muted">Организация</span>
        <select
          value={organization}
          onChange={(event) => onOrganizationChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        >
          <option value="">Все</option>
          {organizations.map((org) => (
            <option key={org} value={org}>
              {org}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-sm text-muted">Категория запчастей</span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
        >
          <option value="">Все</option>
          {CATEGORIES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
