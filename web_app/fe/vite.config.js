// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import { resolve } from 'path'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       input: {
//         main: resolve(__dirname, 'index.html'),
//         'pdf.worker': resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.mjs'),
//       },
//     },
//   },
//   optimizeDeps: {
//     include: ['pdfjs-dist/build/pdf.worker.mjs'],
//   },
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//         secure: false,
//       },
//       '/auth': {
//         target: 'http://localhost:8080',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          'pdf.worker': resolve(__dirname, 'node_modules/pdfjs-dist/build/pdf.worker.mjs'),
        },
      },
    },
    optimizeDeps: {
      include: ['pdfjs-dist/build/pdf.worker.mjs'],
    },
    define: {
      'import.meta.env.VITE_API_ENDPOINT': JSON.stringify(env.VITE_API_ENDPOINT || 'http://localhost/api'),
      'import.meta.env.VITE_CHROME_EXTENSION_ID': JSON.stringify(env.VITE_CHROME_EXTENSION_ID),
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_ENDPOINT || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/auth': {
          target: env.VITE_API_ENDPOINT || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})