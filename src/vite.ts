import { resolve } from 'path';
import { Plugin, ResolvedConfig } from 'vite';

import { Confit, GetConfitOptions, getConfit } from './confit.js';

export function confitPlugin(
  options: GetConfitOptions & {
    callback?: (confit: Confit) => Confit,
  },
): Plugin & { confit: Confit } {
  const {
    callback = (confit: Confit) => confit,
    enforceTarget = true,
    name = 'confit',
    root = null,
    target = null,
  } = {
    ...options,
  };

  const virtualModuleId = `@${name}`;
  const resolvedVirtualModuleId = '\0' + virtualModuleId;
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
      enforceTarget,
      name,
      target: target || process.env.CONFIT_TARGET,
    },
  ));

  let config: ResolvedConfig;

  return {
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    confit,
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `
        const ${name} = Object.freeze(${JSON.stringify(confit)});
        ${config.command === 'serve' ? `console.log('[${name}]', ${name});` : ''}
        export default ${name};
        `;
      }
    },
    name: name,
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
  };
}
