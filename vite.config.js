import { defineConfig } from 'vite';
import confit from './src/vite';

const root = 'example-vite';

// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [
    confit({
      root,
    }),
  ],
});
