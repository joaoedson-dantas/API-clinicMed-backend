import { Address } from '@/models/Address'
import { AddressRepository } from '../address-repository'
import { randomUUID } from 'crypto'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []

  async update(data: Address) {
    const { id, ...dataUpdated } = data

    this.items.forEach((item) => {
      if (item.id === id) {
        return { id, ...dataUpdated }
      }
    })

    return { ...data }
  }

  async create(data: Omit<Address, 'id'>) {
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
    const address = this.items.find((item) => item.id === id) as Address

    return address
  }
}
