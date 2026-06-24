export type DocumentType = 'receipt' | 'work_order'

export type PartCategory =
  | 'oil_fluids'
  | 'filters'
  | 'suspension'
  | 'brakes'
  | 'steering'
  | 'electrical'
  | 'engine'
  | 'other'

export interface VehicleInfo {
  make: string
  model: string
  vin: string
  year: number
  license_plate: string
}

export interface ReceiptItem {
  name: string
  quantity: number
  price: number | null
}

export interface WorkItem {
  name: string
  price: number
  discount?: number
  total?: number
  executors?: string[]
}

export interface PartItem {
  name: string
  price: number
  quantity?: number
}

export interface ReceiptDocument {
  type: 'receipt'
  number: string
  date: string
  supplier: string
  inn: string
  total: number
  discount?: number
  items: ReceiptItem[]
}

export interface WorkOrderDocument {
  type: 'work_order'
  number: string
  date: string
  supplier: string
  inn: string
  total: number
  mileage?: number
  vat?: number
  work_items: WorkItem[]
  parts?: PartItem[]
}

export type Document = ReceiptDocument | WorkOrderDocument

export interface CarHistoryData {
  source_file: string
  processed_date: string
  vehicle_info: VehicleInfo & {
    owner?: string
    owner_phone?: string
  }
  documents: Document[]
  summary: {
    total_documents: number
    total_receipts: number
    total_work_orders: number
    date_range: { from: string; to: string }
  }
}

export interface UnifiedWork {
  name: string
  price: number
  total?: number
  discount?: number
  executors?: string[]
  organization: string
  documentNumber: string
}

export interface UnifiedPart {
  name: string
  category: PartCategory
  label: string
  quantity: number
  price: number | null
  source: 'receipt' | 'work_order'
  organization: string
  documentNumber: string
  date: string
}

export interface ServiceVisit {
  date: string
  organizations: string[]
  documents: Document[]
  totalAmount: number
  mileage?: number
  parts: UnifiedPart[]
  works: UnifiedWork[]
}

export interface PartReplacementHistory {
  category: PartCategory
  label: string
  events: UnifiedPart[]
}

export interface OrganizationStats {
  name: string
  inn: string
  visitCount: number
  totalAmount: number
  dates: string[]
}

export interface YearlySpending {
  year: number
  amount: number
}

export interface MileagePoint {
  date: string
  mileage: number
}

export interface CategorySpending {
  category: PartCategory
  amount: number
  count: number
}

export type TabId = 'timeline' | 'parts' | 'organizations' | 'summary' | 'intervals'
