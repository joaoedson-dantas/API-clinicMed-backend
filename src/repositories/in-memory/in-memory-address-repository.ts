import { Address, Prisma } from '@prisma/client'
import { AddressRepository } from '../address-repository'

export class InMemoryAddressRepository implements AddressRepository {
  public items: Address[] = []
  async create(data: Prisma.AddressCreateInput) {
    const address = {
      id: 'address-01',
      road: data.road,
      district: data.district,
      cep: data.cep,
      zip_code: data.zip_code,
      complement: null,
      number: null,
      uf: data.cep,
      city: data.city,
    }

    this.items.push(address)

    return address
  }

  async getByAddress(addressId: string) {
    const address = this.items.find((item) => item.id === addressId)

    if (!address) {
      return null
    }
    return address
  }
}
