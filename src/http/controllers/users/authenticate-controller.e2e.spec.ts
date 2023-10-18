import request from 'supertest'
import { app } from '@/app'

describe('Authenticate (e2e) ', () => {
  beforeAll(async () => {
    await app.ready() // garantir que o app esteja pronto
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to authenticate', async () => {
    // criando um usuário
    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      login: 'jhondoe1',
      password: '123456',
    })

    const response = await request(app.server).post('/sessions').send({
      login: 'jhondoe1',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
