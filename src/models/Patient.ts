export interface Patient {
  id?: string | undefined
  name: string
  email: string
  tel: string
  cpf: string
  addressId: string
  activated?: boolean
  created_at?: Date
}
