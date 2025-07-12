import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/main/**/*.ts',
    'src/config/**/*.ts',
    'src/utils/**/*.ts',
  ],
  outDir: 'dist',
  target: 'node20',
  format: ['esm'],
  bundle: true,
  clean: true,
  dts: false,
  sourcemap: false,
  external: [
    'electron',
  ],
})
