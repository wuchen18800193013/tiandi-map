import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      // 可选配置
      styleId: 'my-library-styles',
      preRenderCSSCode: (cssCode) => `${cssCode}`,
      injectCode: (cssCode) => `
        if (typeof document !== 'undefined') {
          const style = document.createElement('style');
          style.textContent = \`${cssCode}\`;
          style.id = 'my-library-styles';
          document.head.appendChild(style);
        }
      `,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'TiandiMap',
      formats: ['es'],
      fileName: (format) => `tiandi-map.${format}.js`
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'prop-types'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'prop-types': 'PropTypes'
        }
      }
    },
    cssCodeSplit: false,
  }
})