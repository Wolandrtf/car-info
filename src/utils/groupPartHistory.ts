import type { PartReplacementHistory } from '../types'

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
