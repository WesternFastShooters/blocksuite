import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 确保这个配置存在，将所有资源路径变为相对路径
  plugins: [
    wasm(),
    vanillaExtractPlugin(),
  ],
  esbuild: {
    target: 'es2018',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'apps/vscode-integration/main.ts'),
      name: 'BlockSuiteVSCodeIntegration',
      fileName: 'blocksuite-bundle',
      formats: ['es'],
    },
    rollupOptions: {
      // 将所有依赖打包到一起，不externalize任何包
      external: [],
      output: {
        // 确保所有代码都打包在一个文件中
        inlineDynamicImports: true,
        manualChunks: undefined,
      },
    },
    // 确保构建输出目录
    outDir: resolve(__dirname, '../../vscode-blocksuite-plugin/dist'),
    emptyOutDir: false,
  },
  // 定义环境变量，避免在VSCode webview中出现问题
  define: {
    'import.meta.env.PLAYGROUND_SERVER': JSON.stringify(''),
    'import.meta.env.PLAYGROUND_WS': JSON.stringify(''),
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
}); 