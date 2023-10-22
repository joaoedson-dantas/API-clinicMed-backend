import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Exclusion Doctor (e2e) ', () => {
  it('should be able to delete a doctor', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. Malu Dantas',
        email: 'malu.dantas@gmail.com',
        activated: true,
        crm: '45663-SP',
        specialty: 'CARDIOLOGIA',
        tel: '85984420772',
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

    const doctorId = response.body.id
    const activated = response.body.activated

    const exclusionResponse = await request(app.server)
      .delete(`/doctor/${doctorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ activated })

    expect(exclusionResponse.statusCode).toEqual(204)
  })
})
