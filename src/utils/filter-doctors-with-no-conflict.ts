import { Doctor } from '@/models/Doctor'
import { InMemoryQuerysMedRepository } from '@/repositories/in-memory/in-memory-querys-repository'

const queryMedRepository = new InMemoryQuerysMedRepository()
export async function filterDoctorsWithNoConflict(
  doctors: Array<
    Pick<Doctor, 'name' | 'email' | 'crm' | 'activated' | 'specialty' | 'id'>
  >,
  start_time: Date,
) {
  const availableDoctor: Array<
    Pick<Doctor, 'name' | 'email' | 'crm' | 'activated' | 'specialty' | 'id'>
  > = []

  for (const doctor of doctors) {
    const hasConflict = await queryMedRepository.hasDoctorConflict(
      doctor.id,
      start_time,
    )

    if (!hasConflict) {
      availableDoctor.push(doctor)
    }
  }

  return availableDoctor
}
