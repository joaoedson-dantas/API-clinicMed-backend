import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    login: z.string().min(3),
    password: z.string().min(6),
  })

  const { login, password } = authenticateBodySchema.parse(request.body)

  try {
    // instaciando o caso de uso e passando as dependencias por parametro
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      login,
      password,
    })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )
    const refreshToken = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
          expiresIn: '1d',
        },
      },
    )

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/', // quais rotas da aplicação teram acesso ao cookie, neste caso, todas as rotas
        secure: true, // Define que cookie vai ser encriptado pelo https, se for true, o front não vai conseguir ler o valor desse cookie
        sameSite: true, // cookie só vai ser disponível dentro do mesmo site
        httpOnly: true, // indica que só será possível acessar pelo back-end
      })
      .status(200)
      .send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}
