import { Address } from '@/models/Address'
import { AddressRepository } from '../address-repository'
import { prisma } from '@/lib/prisma'

export class PrismaAddressRepository implements AddressRepository {
  async create(data: Address): Promise<Address> {
    const address = await prisma.address.create({
      data,
    })
    return address
  }

  async getAddressById(id: string) {
    const address = await prisma.address.findUnique({
      where: {
        id,
      },
    })
    return address
  }
}
