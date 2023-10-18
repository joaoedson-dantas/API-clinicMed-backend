import request from 'supertest'
import { app } from '@/app'

describe('Profile (e2e) ', () => {
  beforeAll(async () => {
    await app.ready() // garantir que o app esteja pronto
  })

  afterAll(async () => {
    await app.close()
  })
  it('should be able to get user profile', async () => {
    // criando um usuário
    await request(app.server).post('/users').send({
      name: 'Jhon Doe',
      login: 'jhondoe123',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      login: 'jhondoe123',
      password: '123456',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        login: 'jhondoe123',
      }),
    )
  })
})
