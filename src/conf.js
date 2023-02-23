const nunjucks = require('nunjucks');
const { getFiles } = require('./files');
const { readYaml } = require('./yaml');
const homedir = require('os').homedir();
const merge = require('merge-deep');
const { basename, dirname } = require('path');

const TARGET_TOKEN = 'target#';

function basenameFilter(filePath) {
  return basename(filePath)
}

function dirnameFilter(filePath) {
  return diname(filePath)
}

const env = new nunjucks.Environment()

env.addFilter('dirname', dirnameFilter, true);
env.addFilter('basename', basenameFilter, false);

function getConfTargets(conf) {
  return Object.keys(conf)
    .filter((key) => key.startsWith(TARGET_TOKEN))
    .map((key) => key.replace(TARGET_TOKEN, ''));
}

function confHasTarget(conf) {
  return Boolean(getConfTargets(conf).length);
}

function applyTarget(conf, target) {
  targetConfKey = `${TARGET_TOKEN}${target}`;
  targetConf = conf[targetConfKey];
  cleanConf = Object.keys(conf).reduce((result, key) => {
    if (key.startsWith(TARGET_TOKEN)) {
      return result;
    }
    return Object.assign(result, { [key]: conf[key] });
  }, {});

  return merge(cleanConf, targetConf);
}

function cleanTargets(conf, targets) {
    targets.forEach((target) => {
      delete conf[TARGET_TOKEN + target]
    });
    return conf
}


function getFirstRooIndex(confs) {
  for (var i = 0, len = confs.length; i < len; i++) {
    if (confs[i].root) {
      return i;
    }
  }
  return -1;
}

function getConfit(path, {
  name = 'confit',
  target = null,
  tree = true,
  rootDir = homedir,
  enforceTarget = true,
} = {}) {
  const fileName = `${name}.yaml`;
  const files = [fileName, `.${fileName}`];
  let confs = getFiles(path, files, tree, rootDir).map((path) => readYaml(path).toJSON());

  if (!confs.length) {
    throw Error('Confit file not found.');
  }

  let conf = merge(...confs.reverse());

  confTargets = getConfTargets(conf);

  if (enforceTarget) {
    if (target) {
      if (!confHasTarget(conf)) {
        throw Error('You must define targets in file.');
      }

      if (!confTargets.includes(target)) {
        throw Error(`Target "${target}" not found`);
      }

      conf = applyTarget(conf, target)

    } else {
      if (confHasTarget(conf)) {
        throw Error('You must pass a target.');
      }
    }
  } else {
    if (target) {
      conf = applyTarget(conf, target)
    } else {
      cleanTargets(conf, confTargets);
    }
  }

  return JSON.parse(env.renderString(JSON.stringify(conf), conf));
}

module.exports = getConfit
