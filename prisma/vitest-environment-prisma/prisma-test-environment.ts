import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  setup: async () => {
    console.log('setup: teste começou')

    return {
      teardown: async () => {
        console.log('teardown: teste finalizado')
      },
    }
  },
  transformMode: 'web', // Defina 'transformMode' como 'web' ou 'ssr'
}
// async setup() -> qual código eu quero executar antes dos testes, vai executar antes de cada arquivo de teste
