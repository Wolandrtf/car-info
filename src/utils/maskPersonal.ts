export function shouldMaskPersonalData(): boolean {
  return import.meta.env.VITE_MASK_PERSONAL_DATA === 'true'
}

export function maskVin(vin: string): string {
  if (!shouldMaskPersonalData() || vin.length <= 4) return vin
  return `${vin.slice(0, 4)}…${vin.slice(-4)}`
}

export function maskLicensePlate(plate: string): string {
  if (!shouldMaskPersonalData() || plate.length <= 3) return plate
  return `${plate.slice(0, 2)}***`
}
