import { FastifyInstance } from 'fastify'
import { verifyJWT } from '../../middlewares/verify-jwt'
import { createAppointment } from './create-appointment-controller'
import { appointmentCancellation } from './ appointment-cancellation-controller'
import { getAppointment } from './get-appointment-with-doctor-and-patient-controller'

export async function appointmentRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT) // middleware que vai fazer a verificação se as rotas estão autenticadas

  app.post('/appointment', createAppointment)
  app.delete('/appointment', appointmentCancellation)
  app.get('/appointment', getAppointment)
}

/*   app.post('/appointment', createAppointment)
  app.delete('/appointment', appointmentCancellation)
  app.get('/appointment', getAppointment) */
