import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Get List Doctor (e2e) ', () => {
  it('should be able get list doctors', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. João Edson Dantas',
        email: 'joaoedson.dantas@gmail.com',
        activated: true,
        crm: '34667-AM',
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

    await request(app.server)
      .post('/doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. Leia Bernardo Dantas',
        email: 'leia.dantas@gmail.com',
        activated: true,
        crm: '34567-CE',
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

    const response = await request(app.server)
      .get('/doctors')
      .set('Authorization', `Bearer ${token}`)
      .query({ page: 1 })
      .send()

    expect(response.statusCode).toEqual(200)

    expect(response.body.doctorsOrder).toEqual(
      expect.arrayContaining([
        {
          name: expect.any(String),
          activated: true,
          crm: expect.any(String),
          email: expect.any(String),
          specialty: 'CARDIOLOGIA',
        },
      ]),
    )
  })
})
