import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create Doctor (e2e) ', () => {
  it('should be able to create a doctor', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Leia',
        email: 'leialb28@gmail.com',
        activated: true,
        crm: '12345-SP',
        specialty: 'CARDIOLOGIA',
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
