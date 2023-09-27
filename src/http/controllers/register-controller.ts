import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { registerUserUseCase } from '@/use-cases/register-user'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    login: z.string(),
    password: z.string().min(6),
  })

  const { name, login, password } = registerBodySchema.parse(request.body)

  try {
    await registerUserUseCase({
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

/*  1 - Requisisão HTTP 2 -> Controller(HTTP) -> Caso de uso(Regra de negócio)  */
