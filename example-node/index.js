const getConfit = require('..');
const target = process.env.CONFIT_TARGET || 'live'
const conf = getConfit(
    process.cwd(),
    {
      target,
      tree: true,
      enforceTarget: false,
    }
);

console.log(conf);
