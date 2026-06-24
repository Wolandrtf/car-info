import type { UnifiedPart } from '../types'

/** Сумма строки: в чеке price — итог по позиции, в ЗН — цена × количество. */
export function getPartLineAmount(part: UnifiedPart): number {
  if (part.price == null) return 0
  if (part.source === 'receipt') return part.price
  return part.price * part.quantity
}
