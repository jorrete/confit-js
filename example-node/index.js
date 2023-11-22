import getConfit from '../src/confit.js';

const target = process.env.CONFIT_TARGET || 'live';
const conf = getConfit(
  process.cwd(),
  {
    enforceTarget: false,
    target,
    tree: true,
  },
);

console.log(conf);
