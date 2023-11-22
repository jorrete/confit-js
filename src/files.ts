import { existsSync } from 'fs';
import { dirname, join } from 'path';

export function getFiles(
  path: string,
  files: string[],
  tree: boolean,
  rootDir: string,
): string[] {
  const matches: string[] = [];

  for (let i = 0, len = files.length; i < len; i++) {
    const filePath = join(path, files[i]);
    if (existsSync(filePath)) {
      matches.push(filePath);
      break;
    }
  }

  if (tree && path !== rootDir) {
    matches.push(...getFiles(dirname(path), files, tree, rootDir));
  }

  return matches;
}
