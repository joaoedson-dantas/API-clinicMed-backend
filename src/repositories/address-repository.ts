import { Address } from '@/models/Address'

export interface AddressRepository {
  create(data: Omit<Address, 'id'>): Promise<Address>
  update(data: Address): Promise<Address>
  getAddressById(id: string): Promise<Address>
}
