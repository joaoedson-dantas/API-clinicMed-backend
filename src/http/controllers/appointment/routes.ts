import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'

export async function appointmentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // middleware que vai fazer a verificação se as rotas estão autenticadas
}
