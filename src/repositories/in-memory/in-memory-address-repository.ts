import { Address } from '@/models/Address'
import { AddressRepository } from '../address-repository'
import { randomUUID } from 'crypto'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []
  async create(data: Address) {
    const { city, district, road, uf, zip_code, complement, number } = data
    const address = {
      id: randomUUID(),
      city,
      district,
      road,
      uf,
      zip_code,
      complement,
      number,
    }
    this.items.push(address)

    return address
  }

  async getAddressById(id: string) {
    const address = this.items.find((item) => item.id === id)

    if (!address) {
      return null
    }
    return address
  }
}
