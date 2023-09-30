import { Address, Prisma } from '@prisma/client'

export interface AddressRepository {
  create(data: Prisma.AddressCreateInput): Promise<Address>
  getByAddress(addressId: string): Promise<Address | null>
}
