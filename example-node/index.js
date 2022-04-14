const getConfit = require('..');
const target = process.env.CONFIT_TARGET || 'local'

const conf = getConfit(
    '/home/jorro/Development/javascript/confit/example-node',
    {
      target,
      tree: true,
      enforceTarget: false,
    }
);

console.log(conf);
