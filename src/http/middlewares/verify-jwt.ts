import { FastifyReply, FastifyRequest } from 'fastify'

export async function verifyJWT(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify()
  } catch {
    return reply.status(401).send({ message: 'Unauthorized.' })
  }
}

// validando que o token é realmente gerado pela aplicação e buscar os dados que estão contidos dentro do token
