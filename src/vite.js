const getConfit = require('./conf');
const { resolve } = require('path');

function confitPlugin({
  root = null,
  file = 'confit',
  target = null,
} = {}) {
  const virtualModuleId = `@${file}`
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

  const confit = getConfit(
    configPath,
    {
      file,
      target: target || process.env.CONFIT_TARGET || 'local',
    }
  );

  return {
    name: file,
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
