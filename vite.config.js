import { defineConfig } from 'vite';
import confit from './src/vite';

const root = 'example-vite';

const config = confit({
  target: 'local',
  root,
});

console.log(config);
// https://vitejs.dev/config/
export default defineConfig({
  root,
  plugins: [
    config,
  ],
});
