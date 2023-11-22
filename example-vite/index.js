import getConfit from '../src/confit.js';

const target = process.env.CONFIT_TARGET || 'local';

const conf = getConfit(
  '/home/jorro/Development/node/confit/example',
  {
    target,
    tree: true,
  },
);

console.log(conf);
