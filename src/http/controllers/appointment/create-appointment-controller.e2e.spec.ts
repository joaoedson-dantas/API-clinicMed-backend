import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import dayjs from 'dayjs'

describe('Create Appontiment (e2e) ', () => {
  it('should be able to create a appontiment', async () => {
    beforeEach(async () => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    const { token } = await createAndAuthenticateUser(app)
    vi.setSystemTime(new Date(2023, 11, 7, 10, 0, 0))
    const appointmentTime = dayjs(new Date()).add(30, 'minute')

    const doctor = await request(app.server)
      .post('/doctor')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Dr. Edson Dantas',
        email: 'dredson.dantas@gmail.com',
        activated: true,
        crm: '99456-SP',
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
      .post('/patient')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Maria Iracir Fernandes Silva',
        email: 'maria.dantas@gmail.com',
        cpf: '02694414257',
        activated: true,
        tel: '85991442728',
        address: {
          city: 'Paramoti',
          district: 'Rua travessa do amor',
          road: 'teododro',
          uf: 'ce',
          zip_code: '61336000',
          complement: 'casa',
          number: '186',
        },
      })

    const patientCPF = '02694414257'
    const doctorId = doctor.body.id

    const query = await request(app.server)
      .post('/appointment')
      .set('Authorization', `Bearer ${token}`)
      .send({
        patientCPF,
        doctorId,
        specialty: 'CARDIOLOGIA',
        start_time: appointmentTime.format(),
      })

    expect(query.statusCode).toEqual(201)
  })
})
