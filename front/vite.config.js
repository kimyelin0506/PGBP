import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',                // frontend/ 가 루트
  base: '/PGBP/app/',     // 정적 리소스 기본 경로 (운영 기준)
  server: {
    port: 5173,
    open: true,
    proxy: {
         // 프론트에서 '/PINS/...' 로 부르면 백엔드 8080으로 프록시(자동 설정)
      '/PINS': { target: 'http://localhost:8080', changeOrigin: true },
    }
  },
  build: {
    outDir: '../src/main/resources/static/app',
    emptyOutDir: true,
    // 해시 대신 고정 파일명 쓰면 JSP에서 include가 쉬움
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        assetFileNames: 'assets/[name][extname]'
      }
    }
  }
});
