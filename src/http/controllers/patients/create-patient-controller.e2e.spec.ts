import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Patient (e2e) ', () => {
  it('should be able to create a patient', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/patient')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João Edson Dantas',
        email: 'joaoedson.dantas@gmail.com',
        cpf: '04005103324',
        activated: true,
        tel: '85992002329',
        address: {
          city: 'Fortaleza',
          district: 'Granja Portugal',
          road: 'teododro',
          uf: 'ce',
          zip_code: '60541195',
          complement: 'ap5',
          number: '766',
        },
      })

    expect(response.statusCode).toEqual(201)
  })
})
