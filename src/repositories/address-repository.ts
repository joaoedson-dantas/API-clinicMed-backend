import { Address } from '@/models/Address'

export interface AddressRepository {
  create(data: Omit<Address, 'id'>): Promise<Address>
  getAddressById(id: string): Promise<Address | null>
}
