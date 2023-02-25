const { existsSync } = require('fs');
const { join, dirname } = require('path');

function getFiles(path, files, tree, rootDir) {
  const matches = [];

  for (let i = 0, len = files.length; i < len; i++) {
    const filePath = join(path, files[i]);
    if (existsSync(filePath)) {
      matches.push(filePath);
      break;
    }
  }

  if (tree && path !== rootDir) {
    matches.push(...getFiles(dirname(path), files, rootDir));
  }

  return matches;
}

module.exports = { getFiles };
