import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Update Patient (e2e) ', () => {
  it('should be able to UPDATE a patient', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const response = await request(app.server)
      .post('/patient')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João Edson Dantas Silva',
        email: 'aa12344@gmail.com',
        cpf: '14005607899',
        activated: true,
        tel: '85981049297',
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

    const updateResponse = await request(app.server)
      .put(`/patient/${response.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'João Edson Dantas ATUALIZADO',
        tel: '85992002322',
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
