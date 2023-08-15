import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_URL': JSON.stringify('https://reqres.in/api'),
  },
})
