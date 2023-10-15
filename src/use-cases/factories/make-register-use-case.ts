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

serve para automatizar o trabalho de criação de um caso de uso. Onde um caso de uso pode ter multiplas dependencias, e sempre que se utilizar o caso de uso, a função já vai exportar o caso de uso pronto
*/
