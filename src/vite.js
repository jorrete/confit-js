const getConfit = require('./conf');
const { resolve } = require('path');

function confitPlugin({
  root = null,
  name = 'confit',
  target = null,
  callback = (confit) => confit,
  enforceTarget = true,
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
      enforceTarget,
    }
  ));

  let config;

  return {
    confit,
    name: name,
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
        const ${name} = Object.freeze(${JSON.stringify(confit)});
        ${config.command === 'serve' ? `console.log('[${name}]', ${name});` : ''}
        export default ${name};
        `;
      }
    }
  }
}

module.exports = confitPlugin;
