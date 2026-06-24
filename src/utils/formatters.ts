import { format, isValid, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

function parseDateSafe(dateStr: string): Date | null {
  const date = parseISO(dateStr)
  return isValid(date) ? date : null
}

export function formatDate(dateStr: string): string {
  const date = parseDateSafe(dateStr)
  if (!date) return dateStr
  return format(date, 'd MMMM yyyy', { locale: ru })
}

export function formatDateShort(dateStr: string): string {
  const date = parseDateSafe(dateStr)
  if (!date) return dateStr
  return format(date, 'dd.MM.yyyy', { locale: ru })
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatMileage(mileage: number): string {
  return `${new Intl.NumberFormat('ru-RU').format(mileage)} км`
}
