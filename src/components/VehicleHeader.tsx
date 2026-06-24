import type { VehicleInfo } from '../types'
import { formatDateShort } from '../utils/formatters'

interface VehicleHeaderProps {
  vehicle: VehicleInfo
  dateRange: { from: string; to: string }
}

export function VehicleHeader({ vehicle, dateRange }: VehicleHeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto max-w-5xl px-4 py-5">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          История обслуживания
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-slate-900">
          {vehicle.make} · {vehicle.license_plate}
        </h1>
        <p className="mt-1 text-sm text-muted">{vehicle.model}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span>Год: {vehicle.year}</span>
          <span className="font-mono text-xs text-slate-500">VIN: {vehicle.vin}</span>
          <span>
            Период: {formatDateShort(dateRange.from)} — {formatDateShort(dateRange.to)}
          </span>
        </div>
      </div>
    </header>
  )
}
