import { Query } from '@prisma/client'

export interface Patient {
  id?: string
  name: string
  email: string
  tel: string
  cpf: string
  addressId: string
  activated?: boolean
  created_at?: Date
  querys?: Query[]
}
