import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { getListDoctors } from './ get-list-doctors-controller'
import { createDoctor } from './create-doctor-controller'
import { updateDoctor } from './doctor-update-controller'
import { exclusionOfDoctor } from './doctor-exclusion-controller'

export async function doctorRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // middleware que vai fazer a verificação se as rotas estão autenticadas

  app.get('/doctor/get-list', getListDoctors)
  app.post('/doctor', createDoctor)
  app.put('/doctor', updateDoctor)
  app.delete('/doctor', exclusionOfDoctor)
}
