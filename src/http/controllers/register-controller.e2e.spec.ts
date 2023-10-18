import request from 'supertest'
import { app } from '@/app'

describe('Register (e2e) ', () => {
  beforeAll(async () => {
    await app.ready() // garantir que o app esteja pronto
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to register', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      login: 'jhondoe',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
