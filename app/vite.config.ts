import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

const PREVIA = process.env.PREVIA === '1';

export default defineConfig({
  base: './',
  plugins: [react(), ...(PREVIA ? [viteSingleFile({ removeViteModuleLoader: true })] : [])],
  define: PREVIA ? { 'import.meta.env.VITE_PREVIA': JSON.stringify('1') } : {},
  build: PREVIA ? { assetsInlineLimit: 100_000_000, cssCodeSplit: false, copyPublicDir: false } : {},
  server: { port: 5173, host: true },
  test: { environment: 'jsdom', include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'] },
});
