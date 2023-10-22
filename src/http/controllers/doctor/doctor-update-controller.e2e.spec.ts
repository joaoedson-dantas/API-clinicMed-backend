import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update Doctor (e2e) ', () => {
  it('should be able to UPDATE a doctor', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. João 3387',
        email: 'joaoedson884@gmail.com',
        activated: true,
        crm: '34512-SP',
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

    console.log(response.body.id)

    const updateResponse = await request(app.server)
      .put(`/doctor/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. João 3387 atualizado com sucesso',
        tel: '85992002322',
        specialty: 'CARDIOLOGIA',
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
    expect(updateResponse.statusCode).toEqual(204)
  })
})
