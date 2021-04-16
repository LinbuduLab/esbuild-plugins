import { generateFiles, names, Tree } from '@nrwl/devkit';
import path from 'path';
import { appendExportToIndexFile } from './append-export';

export function handleAppFileGeneration(
  host: Tree,
  type: string,
  name: string,
  dir: string
) {
  // Directive directive
  const { className, fileName } = names(type);

  const substitutions = {
    tmpl: '',
    [className]: name,
    name,
  };

  generateFiles(
    host,
    path.join(__dirname, `./files/${fileName}`),
    dir,
    substitutions
  );
}

export function handleLibFileGeneration(
  host: Tree,
  type: string,
  name: string,
  sourceRoot: string,
  dir: string,
  exportFrom: string
) {
  const { className, fileName } = names(type);

  const substitutions = {
    tmpl: '',
    [className]: name,
    name,
  };

  const libSourceIndexFilePath = path.join(sourceRoot, './index.ts');
  const libSourceIndexFileContent = host
    .read(libSourceIndexFilePath)
    .toString('utf-8');

  generateFiles(
    host,
    path.join(__dirname, `./files/${fileName}`),
    dir,
    substitutions
  );

  const updatedIndexFileContent = appendExportToIndexFile(
    libSourceIndexFilePath,
    libSourceIndexFileContent,
    exportFrom,
    name
  );

  host.write(libSourceIndexFilePath, updatedIndexFileContent);
}
