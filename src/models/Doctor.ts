import { Query } from '@prisma/client'

export enum Specialty {
  CLINICO_GERAL = 'CLINICO_GERAL',
  ORTOPEDIA = 'ORTOPEDIA',
  CARDIOLOGIA = 'CARDIOLOGIA',
  GINECOLOGIA = 'GINECOLOGIA',
  DERMATOLOGIA = 'DERMATOLOGIA',
}

export interface Doctor {
  id: string
  name: string
  email: string
  tel: string
  crm: string
  specialty: Specialty
  addressId: string
  activated: boolean
  querys?: string[]
}
