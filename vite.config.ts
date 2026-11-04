import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

// Zwei Build-Modi:
//   npm run build         -> dist/client        (Container/Server-Modus, Backend liefert die Dateien aus)
//   npm run build:static  -> dist-static        (ohne Backend, relative Pfade, einbettbar per <iframe>)
export default defineConfig(({ mode }) => {
  const isStatic = mode === 'static'
  return {
    plugins: [preact(), tailwindcss()],
    base: isStatic ? './' : '/',
    build: {
      outDir: isStatic ? 'dist-static' : 'dist/client',
      emptyOutDir: true,
    },
    server: {
      proxy: { '/api': 'http://localhost:3000' },
    },
  }
})
