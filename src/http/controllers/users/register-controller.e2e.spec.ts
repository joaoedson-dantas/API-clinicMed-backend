/* import { describe, it, beforeAll, afterAll, expect } from 'vitest' */
import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e) ', () => {
  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Jhon Doe 5 ',
      login: 'jhondoe13d',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
