const getConfit = require('./conf');
const { resolve } = require('path');

function confitPlugin({
  root = null,
  name = 'confit',
  target = null,
  callback = (confit) => confit,
} = {}) {
  const virtualModuleId = `@${name}`
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const cwd = process.cwd();
  const configPath = (
    !root
      ? cwd
      : (
        root.startsWith('/')
          ? root
          : resolve(process.cwd(), root)
      )
  );

  const confit = callback(getConfit(
    configPath,
    {
      name,
      target: target || process.env.CONFIT_TARGET,
    }
  ));

  return {
    confit,
    name: name,
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${JSON.stringify(confit)}`;
      }
    }
  }
}

module.exports = confitPlugin;
