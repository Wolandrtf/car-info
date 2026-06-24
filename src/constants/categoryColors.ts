import type { PartCategory } from '../types'

export const CATEGORY_LABELS: Record<PartCategory, string> = {
  oil_fluids: 'Масла и жидкости',
  filters: 'Фильтры',
  suspension: 'Подвеска',
  brakes: 'Тормоза',
  steering: 'Рулевое',
  electrical: 'Электрика',
  engine: 'Двигатель',
  other: 'Прочее',
}

export const CATEGORY_BADGE_CLASSES: Record<PartCategory, string> = {
  oil_fluids: 'bg-amber-100 text-amber-800',
  filters: 'bg-emerald-100 text-emerald-800',
  suspension: 'bg-orange-100 text-orange-800',
  brakes: 'bg-red-100 text-red-800',
  steering: 'bg-violet-100 text-violet-800',
  electrical: 'bg-yellow-100 text-yellow-800',
  engine: 'bg-sky-100 text-sky-800',
  other: 'bg-slate-100 text-slate-600',
}
