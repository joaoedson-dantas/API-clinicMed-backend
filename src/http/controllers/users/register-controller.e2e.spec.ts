/* import { describe, it, beforeAll, afterAll, expect } from 'vitest' */
import request from 'supertest'
import { app } from '@/app'

test('Register (e2e) ', async () => {
  const response = await request(app.server).post('/users').send({
    name: 'Jhon Doe 5 ',
    login: 'jhondoe13d',
    password: '123456',
  })

  expect(response.statusCode).toEqual(201)
})
