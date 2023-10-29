import request from 'supertest'
import { app } from '@/app'

describe('Refresh Token (e2e) ', () => {
  beforeAll(async () => {
    await app.ready() // garantir que o app esteja pronto
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to Refresh a Token', async () => {
    // criando um usuário
    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      login: 'jhondoe1',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      login: 'jhondoe1',
      password: '123456',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
