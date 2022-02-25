const { parseDocument } = require('yaml');
const { readFileSync } = require('fs');

function readYaml(path) {
  return parseDocument(readFileSync(path, 'utf8'))
}

module.exports = { readYaml }
