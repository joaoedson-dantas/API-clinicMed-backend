import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { RegisterUsersUseCase } from '@/use-cases/register-user'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    login: z.string(),
    password: z.string().min(6),
  })

  const { name, login, password } = registerBodySchema.parse(request.body)

  try {
    // instaciando o caso de uso e passando as dependencias por parametro
    const usersRepository = new PrismaUsersRepository()
    const registerUserUseCase = new RegisterUsersUseCase(usersRepository)

    await registerUserUseCase.execute({
      name,
      login,
      password,
    })
  } catch (err) {
    return reply.status(409).send()
  }

  return reply.status(201).send()
}

// controller -> Um nome dado para função que lida com a entrada de dados de uma requisção http e devolve uma resposta de alguma forma. Ou seja, é reposável por lidar com requisisões e retornar as reposatas para o cliente

// controller vai chamar o caso de uso
// Caso de uso vai ter a parte lógica, a parte da funcionalidade em sí.
// repostory vai intecptar qualquer operação que precisa ser feita ao db, é a conexão com o banco, ele serve para se comunicar com o banco de dados.

/*  1 - Requisisão HTTP 2 -> Controller(HTTP) -> 3 -> Caso de uso(Regra de negócio)  
    4 - Vai chamar um repostory -> Vai fazer a comunicação com o db

*/
