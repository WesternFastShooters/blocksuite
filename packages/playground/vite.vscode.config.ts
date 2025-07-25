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
      // 将 JavaScript bundle 命名为 index.js
      fileName: (format) => `index.js`,
      formats: ['es'],
    },
    rollupOptions: {
      // 将所有依赖打包到一起，不externalize任何包
      external: [],
      output: {
        // 确保所有代码都打包在一个文件中
        inlineDynamicImports: true,
        manualChunks: undefined,
        // 将 CSS 输出文件命名为 style.css
        assetFileNames: (assetInfo) => {
          // 如果是主 CSS 文件，将其命名为 style.css
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'style.css';
          }
          // 对于其他资源（如图片等），使用默认命名
          return 'assets/[name][extname]';
        },
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