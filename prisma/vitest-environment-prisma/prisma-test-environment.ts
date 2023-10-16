import 'dotenv/config'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Plese provide a DATABASE_URL environment variable.')
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    // gerando um banco de dados único para cada suite de testes
    const schema = randomUUID()

    console.log(generateDatabaseURL(schema))

    return {
      async teardown() {
        console.log('teardown: teste finalizado')
      },
    }
  },
  transformMode: 'web', // Defina 'transformMode' como 'web' ou 'ssr'
}
