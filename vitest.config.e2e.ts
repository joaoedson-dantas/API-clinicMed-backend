import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    include: ['**/register-controller.e2e.spec.ts'],
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
  plugins: [tsconfigPaths()],
})
