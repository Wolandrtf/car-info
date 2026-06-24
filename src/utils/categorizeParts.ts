import type { PartCategory } from '../types'

interface CategoryRule {
  category: PartCategory
  keywords: string[]
}

const CATEGORY_RULES: CategoryRule[] = [
  { category: 'oil_fluids', keywords: ['масло', 'антифриз', 'cvt', 'охлаждающ', 'жидкость', 'coolant'] },
  { category: 'filters', keywords: ['фильтр'] },
  {
    category: 'suspension',
    keywords: [
      'амортизатор',
      'стойка',
      'стабилизатор',
      'сайлентблок',
      'шаровая',
      'втулка',
      'ступиц',
      'подшипник',
      'пыльник',
      'отбойник',
      'развальный',
      'опор',
    ],
  },
  { category: 'brakes', keywords: ['колодк', 'суппорт', 'тормоз'] },
  { category: 'steering', keywords: ['рулев', 'наконечник', 'рейка', 'тяга'] },
  { category: 'electrical', keywords: ['лампа', 'датчик', 'щетк', 'koito', 'osram', 'вставка'] },
  { category: 'engine', keywords: ['дроссель', 'форсунка', 'патрубок', 'шлейф'] },
]

const SUBTYPE_RULES: Array<{ label: string; keywords: string[] }> = [
  { label: 'Масляный фильтр', keywords: ['маслян', 'w 67', 'w67', 'c901', 'mo901'] },
  { label: 'Воздушный фильтр', keywords: ['воздушн', 'a2801'] },
  { label: 'Фильтр салона', keywords: ['салон', 'ac207', 'lac201', 'cu-1936', 'cu1936'] },
  { label: 'Моторное масло', keywords: ['масло', '5w30', '5w40', 'genesis', 's-oil', 'ngn'] },
  { label: 'Антифриз / охлаждающая жидкость', keywords: ['антифриз', 'coolant', 'охлаждающ'] },
  { label: 'Амортизатор передний', keywords: ['амортизатор', 'передн'] },
  { label: 'Амортизатор задний', keywords: ['амортизатор', 'задн'] },
  { label: 'Стойка стабилизатора', keywords: ['стойка', 'стабилизатор', 'тяга/стойка'] },
  { label: 'Колодки тормозные', keywords: ['колодк'] },
  { label: 'Ступица / подшипник', keywords: ['ступиц', 'подшипник'] },
  { label: 'Шаровая опора', keywords: ['шаровая'] },
  { label: 'Сайлентблок', keywords: ['сайлентблок'] },
  { label: 'Лампы', keywords: ['лампа', 'koito', 'osram'] },
  { label: 'Щётки стеклоочистителя', keywords: ['щетк', 'щётк'] },
  { label: 'Рулевой наконечник', keywords: ['наконечник', 'рулев'] },
]

function normalize(text: string): string {
  return text.toLowerCase().replace(/ё/g, 'е')
}

export function categorizePart(name: string): PartCategory {
  const normalized = normalize(name)

  for (const rule of CATEGORY_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.category
    }
  }

  return 'other'
}

export function getPartLabel(name: string, category: PartCategory): string {
  const normalized = normalize(name)

  for (const rule of SUBTYPE_RULES) {
    if (rule.keywords.every((keyword) => normalized.includes(keyword))) {
      return rule.label
    }
  }

  for (const rule of SUBTYPE_RULES) {
    if (rule.keywords.some((keyword) => normalized.includes(keyword))) {
      return rule.label
    }
  }

  if (category === 'filters') return 'Фильтр'
  if (category === 'oil_fluids') return 'Жидкость'
  if (category === 'suspension') return 'Деталь подвески'
  if (category === 'brakes') return 'Тормозная деталь'
  if (category === 'steering') return 'Рулевая деталь'
  if (category === 'electrical') return 'Электрика'
  if (category === 'engine') return 'Двигатель'

  return 'Прочее'
}
