import { FastifyRequest, FastifyReply } from 'fastify'

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({ onlyCookie: true }) // Vai verificar nos cookies da requisição se existe o refresh token
  const token = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub, // dados do usuário logado
      },
    },
  )
  const refreshToken = await reply.jwtSign(
    {},
    {
      sign: {
        sub: request.user.sub,
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
}
