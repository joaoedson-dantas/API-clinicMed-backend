export interface QueryMed {
  id?: string
  created_at?: Date
  start_time: Date
  end_time: Date
  reason_cancellation: string | null
  patientId: string
  doctorId: string
}
