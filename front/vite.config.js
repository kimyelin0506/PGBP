import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',                // frontend/ 가 루트
  base: '/static/app/',     // 정적 리소스 기본 경로 (운영 기준)
  server: {
    port: 5173,
    open: true,
    proxy: {
      // 개발 중 API를 톰캣으로 프록시 (포트/컨텍스트 맞춰 수정)
      '/biz':    { target: 'http://localhost:8080/PINS', changeOrigin: true },
      '/common': { target: 'http://localhost:8080/PINS', changeOrigin: true }
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
