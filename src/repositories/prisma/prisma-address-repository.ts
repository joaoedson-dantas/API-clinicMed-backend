import { Address } from '@/models/Address'
import { AddressRepository } from '../address-repository'
import { PrismaClient } from '@prisma/client'

export class PrismaAddressRepository implements AddressRepository {
  constructor(private prisma: PrismaClient) {}
  async update({ id, ...dataUpdated }: Address): Promise<Address> {
    const address = await this.prisma.address.update({
      where: {
        id,
      },
      data: {
        id,
        ...dataUpdated,
      },
    })
    return address
  }

  async create(data: Address): Promise<Address> {
    const address = await this.prisma.address.create({
      data,
    })
    return address
  }

  async getAddressById(id: string) {
    const address = await this.prisma.address.findUnique({
      where: {
        id,
      },
    })
    return address
  }
}
