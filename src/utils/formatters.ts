import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'd MMMM yyyy', { locale: ru })
}

export function formatDateShort(dateStr: string): string {
  return format(parseISO(dateStr), 'dd.MM.yyyy', { locale: ru })
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
