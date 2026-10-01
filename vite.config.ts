import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/*.png'],
      manifest: {
        name: 'PJ Center',
        short_name: 'PJ Center',
        description: 'สถานีระดมความคิดด้วยทีม AI สำหรับพัฒนาไอเดียผลิตภัณฑ์',
        start_url: '/',
        display: 'standalone',
        background_color: '#fafafa',
        theme_color: '#6c5ce7',
        orientation: 'any',
        lang: 'th',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
