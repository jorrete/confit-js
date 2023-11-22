import merge from 'merge-deep';
import nunjucks from 'nunjucks';
import { homedir } from 'os';
import { basename, dirname } from 'path';

import { getFiles } from './files.js';
import { readYaml } from './yaml.js';

export type Confit = {
  [key: string]: unknown
}

const TARGET_TOKEN = 'target#';

function basenameFilter(filePath: string) {
  return basename(filePath);
}

function dirnameFilter(filePath: string) {
  return dirname(filePath);
}

const env = new nunjucks.Environment();

env.addFilter('dirname', dirnameFilter, true);
env.addFilter('basename', basenameFilter, false);

function getConfTargets(conf: Confit) {
  return Object.keys(conf)
    .filter((key) => key.startsWith(TARGET_TOKEN))
    .map((key) => key.replace(TARGET_TOKEN, ''));
}

function confHasTarget(conf) {
  return Boolean(getConfTargets(conf).length);
}

function applyTarget(conf: Confit, target: string) {
  const targetConfKey = `${TARGET_TOKEN}${target}`;
  const targetConf = conf[targetConfKey];
  const cleanConf = Object.keys(conf).reduce((result, key) => {
    if (key.startsWith(TARGET_TOKEN)) {
      return result;
    }
    return Object.assign(result, {
      [key]: conf[key], 
    });
  }, {});

  return merge(cleanConf, targetConf);
}

function cleanTargets(conf: Confit, targets: string[]) {
  targets.forEach((target) => {
    delete conf[TARGET_TOKEN + target];
  });
  return conf;
}

export type GetConfitOptions = {
  enforceTarget?: boolean
  name?: string,
  rootDir?: string,
  target?: null | string,
  tree?: boolean,
};

export function getConfit(
  path: string,
  options: GetConfitOptions,
) {
  const {
    enforceTarget = true,
    name = 'confit',
    rootDir = homedir(),
    target = null,
    tree = true,
  } = {
    ...options,
  };

  const fileName = `${name}.yaml`;
  const files = [fileName, `.${fileName}`];
  const confs = getFiles(path, files, tree, rootDir).map((path) => readYaml(path).toJSON()) as Confit[];

  if (!confs.length) {
    throw Error('Confit file not found.');
  }

  confs.reverse();

  let conf = merge({}, ...confs);

  const confTargets: string[] = getConfTargets(conf);

  if (enforceTarget) {
    if (target) {
      if (!confHasTarget(conf)) {
        throw Error('You must define targets in file.');
      }

      if (!confTargets.includes(target)) {
        throw Error(`Target "${target}" not found`);
      }

      conf = applyTarget(conf, target);

    } else {
      if (confHasTarget(conf)) {
        throw Error('You must pass a target.');
      }
    }
  } else {
    if (target) {
      conf = applyTarget(conf, target);
    } else {
      cleanTargets(conf, confTargets);
    }
  }

  return JSON.parse(env.renderString(JSON.stringify(conf), conf));
}
