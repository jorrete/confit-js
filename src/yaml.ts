import { readFileSync } from 'fs';
import { parseDocument } from 'yaml';

export function readYaml(path: string) {
  return parseDocument(readFileSync(path, 'utf8'));
}
