import { defineConfig } from 'vite';

import { confitPlugin } from './src/vite';

const root = 'example-vite';

const confit = confitPlugin({
  root,
  target: 'local',
});

console.log(confit);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    confit,
  ],
  root,
});
