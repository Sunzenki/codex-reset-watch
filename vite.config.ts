import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    rollupOptions: { input: {
      main: 'index.html',
      en: 'en/index.html',
      enHistory: 'en/history/index.html',
      zhCN: 'zh-CN/index.html',
      zhCNHistory: 'zh-CN/history/index.html',
      zhTW: 'zh-TW/index.html',
      zhTWHistory: 'zh-TW/history/index.html',
    } },
  },
});
