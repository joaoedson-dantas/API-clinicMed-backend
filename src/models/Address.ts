export interface Address {
  id: string
  road: string
  district: string
  zip_code: string
  complement?: string | null
  number?: string | null
  uf: string
  city: string
}
