// criar casos de uso de registro

import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'
import { RegisterUsersUseCase } from '../register-user'

export function makeRegisterUseCase() {
  const usersRepository = new PrismaUsersRepository()
  const registerUserUseCase = new RegisterUsersUseCase(usersRepository)

  return registerUserUseCase
}

/* Utilizando Factory Pattern - Criação de coisas comuns que tem muitas dependencias 

basicamente o factory é um centralizador de criação de caso de uso. 
*/
