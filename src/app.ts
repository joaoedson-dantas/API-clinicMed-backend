import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import { usersRoutes } from './http/controllers/users/routes'
import { appointmentRoutes } from './http/controllers/appointment/routes'
import { doctorRoutes } from './http/controllers/doctor/routes'
import { patientRoutes } from './http/controllers/patients/routes'
import fastifyCookie from '@fastify/cookie'

export const app = fastify()

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false, // Informa que o cookie que está sendo salvo não é assinado
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(usersRoutes)
app.register(doctorRoutes)
app.register(appointmentRoutes)
app.register(patientRoutes)
app.register(fastifyCookie)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
