import { Query } from '@prisma/client'

export interface Doctor {
  id: string
  name: string
  email: string
  tel: string
  crm: string
  specialty: string
  addressId: string
  activated: boolean
  querys?: Query[]
}
