import type { PartCategory } from '../../types'
import { CATEGORY_BADGE_CLASSES } from '../../constants/categoryColors'
import { cn } from '../../utils/cn'

interface BadgeProps {
  category: PartCategory
  label?: string
  className?: string
}

export function Badge({ category, label, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
        CATEGORY_BADGE_CLASSES[category],
        className,
      )}
    >
      {label}
    </span>
  )
}
