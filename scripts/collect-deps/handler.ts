import consola from 'consola';
import fs from 'fs-extra';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import { Project } from 'ts-morph';
import path from 'path';
import { builtinModules } from 'module';
import sortPackageJson from 'sort-package-json';
import glob from 'glob';
import uniq from 'lodash/uniq';

import {
  PRESERVED_PACKAGE_PEER_DEPS,
  PRESERVED_NX_PEER_DEPS,
} from './constants';
import {
  collectDepsVersionFromRootPackage,
  collectDepsVersionFromProjectPackage,
} from './collect-dep-version';

const isPreservedPeerDep = (dep: string) =>
  [...PRESERVED_NX_PEER_DEPS, ...PRESERVED_PACKAGE_PEER_DEPS].includes(dep);

export function handler(project: string) {
  consola.info(`Handling ${project} \n`);

  const projectPath = path.resolve(process.cwd(), 'packages', project);
  const projectPkgFilePath = path.resolve(projectPath, 'package.json');

  const deps: string[] = [];

  const globbedFiles = glob.sync('**/*.ts', {
    cwd: projectPath,
  });

  const morphProject = new Project({
    tsConfigFilePath: path.resolve(projectPath, 'tsconfig.json'),
    skipAddingFilesFromTsConfig: true,
  });

  globbedFiles.forEach((file) => {
    const sourceFile = morphProject.createSourceFile(
      path.resolve(projectPath, file),
      fs.readFileSync(path.resolve(projectPath, file), 'utf8'),
      { overwrite: true }
    );

    sourceFile.getImportDeclarations().forEach((declaration) => {
      if (!declaration.isModuleSpecifierRelative()) {
        deps.push(declaration.getModuleSpecifierValue());
      }
    });
  });

  const deduplicatedDepList = uniq(deps);

  // @scope/package/src/folder -> @scope/package
  // package/src/xxx -> package
  // package -> package

  // TODO: optimize by lodash method
  const processedDeps = uniq(
    deduplicatedDepList.map((dep) =>
      dep.includes('/')
        ? dep.startsWith('@')
          ? dep.split('/').slice(0, 2).join('/')
          : dep.split('/').shift()
        : dep
    )
  ).filter(
    (dep: string) => !builtinModules.includes(dep)
    // !builtinModules.includes(dep) && !depsToExlude.includes(dep)
  ) as string[];

  // add to peerDependencies
  const addAsPeerDeps = processedDeps.filter((dep: string) =>
    isPreservedPeerDep(dep)
  );

  // add to dependencies
  const addAsDeps = processedDeps.filter(
    (dep: string) => !isPreservedPeerDep(dep)
  );

  const peerDepsWithVersion = collectDepsVersionFromRootPackage(addAsPeerDeps);

  const depsWithVersion: Record<string, string> = {};

  for (const [k, v] of Object.entries(
    collectDepsVersionFromRootPackage(addAsDeps)
  )) {
    v ? (depsWithVersion[k] = v) : void 0;
  }

  const packageDepsWithVersion =
    collectDepsVersionFromProjectPackage(addAsDeps);

  const depsInfoToAdd = {
    dependencies: { ...depsWithVersion, ...packageDepsWithVersion },
    peerDependencies: peerDepsWithVersion,
  };

  const projectPkgContent = jsonfile.readFileSync(projectPkgFilePath, {
    encoding: 'utf-8',
  });

  // TODO: control should override

  projectPkgContent.dependencies = {
    ...projectPkgContent.dependencies,
    ...depsInfoToAdd.dependencies,
  };

  projectPkgContent.peerDependencies = {
    ...projectPkgContent.peerDependencies,
    ...depsInfoToAdd.peerDependencies,
  };

  fs.writeFileSync(
    projectPkgFilePath,
    prettier.format(
      sortPackageJson(
        JSON.stringify({
          ...projectPkgContent,
        })
      ),
      {
        parser: 'json-stringify',
      }
    )
  );
}
