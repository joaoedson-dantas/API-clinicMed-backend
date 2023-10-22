import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { getListPatients } from './get-list-patients-controller'
import { createPatient } from './create-patient-controller'
import { updatePatient } from './patient-update-controller'

export async function patientRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/patients', getListPatients)
  app.post('/patient', createPatient)
  app.put('/patient:id', updatePatient)
}
