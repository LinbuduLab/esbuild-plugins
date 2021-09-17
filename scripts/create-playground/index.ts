import { CAC } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import consola from 'consola';
import nxJSON from '../../nx.json';
import workspaceJSON from '../../workspace.json';
import packageJSON from '../../package.json';
import {
  NxJsonProjectConfiguration,
  ProjectConfiguration,
  ProjectType,
} from '@nrwl/devkit';
import { CompilerOptions, ParsedCommandLine } from 'typescript';
import prettier from 'prettier';
import sortPackageJson from 'sort-package-json';

export default function useCreatePlayground(cli: CAC) {
  cli
    .command('playground [name]', 'Create playground', {
      allowUnknownOptions: true,
    })
    .option('--init [init]', 'Create initial configuration')
    .option('--no-init', 'Donot create initial configuration')
    .alias('p')
    .action(async (name: string, options: { init: boolean }) => {
      const playgroundDir = path.join(process.cwd(), 'e2e', name);
      fs.ensureDirSync(playgroundDir);

      if (options.init) {
        fs.ensureFileSync(path.resolve(playgroundDir, 'src/main/index.ts'));
        fs.writeFileSync(
          path.resolve(playgroundDir, 'src/main/index.ts'),
          "console.log('Yuuuup!')"
        );

        fs.ensureFileSync(path.resolve(playgroundDir, 'tsconfig.json'));
        fs.writeFileSync(
          path.resolve(playgroundDir, 'tsconfig.json'),
          prettier.format(
            JSON.stringify({
              extends: '../../tsconfig.base.json',
              compilerOptions: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                forceConsistentCasingInFileNames: true,
                strict: true,
                noImplicitReturns: true,
                noFallthroughCasesInSwitch: true,
                strictNullChecks: true,
                experimentalDecorators: true,
                emitDecoratorMetadata: true,
                sourceMap: false,
              } as CompilerOptions,
              files: [],
              include: ['src'],
            }),
            { parser: 'json-stringify' }
          )
        );
      }

      const nx: typeof nxJSON = jsonfile.readFileSync(
        path.join(process.cwd(), 'nx.json')
      );
      const workspace: typeof workspaceJSON = jsonfile.readFileSync(
        path.join(process.cwd(), 'workspace.json')
      );

      const packageFile: typeof packageJSON = jsonfile.readFileSync(
        path.join(process.cwd(), 'package.json')
      );

      nx.projects[name] = {
        tags: [],
        implicitDependencies: [],
      };

      const projectConfiguration: ProjectConfiguration &
        NxJsonProjectConfiguration = {
        root: `e2e/${name}`,
        sourceRoot: `e2e/${name}/src`,
        projectType: 'application',
        targets: options.init
          ? {
              dev: {
                executor: 'nx-plugin-workspace:light-node-serve',
                outputs: ['{options.outputPath}'],
                options: {
                  main: `e2e/${name}/src/main.ts`,
                  tsConfig: `e2e/${name}/tsconfig.json`,
                },
              },
            }
          : {},
      };

      workspace.projects[name] = projectConfiguration;

      !packageFile.workspaces.packages.includes(`e2e/${name}`) &&
        packageFile.workspaces.packages.push(`e2e/${name}`);

      fs.writeFileSync(
        path.join(process.cwd(), 'nx.json'),
        prettier.format(JSON.stringify(nx), { parser: 'json-stringify' })
      );
      fs.writeFileSync(
        path.join(process.cwd(), 'workspace.json'),
        prettier.format(JSON.stringify(workspace), { parser: 'json-stringify' })
      );

      fs.writeFileSync(
        path.join(process.cwd(), 'package.json'),
        prettier.format(sortPackageJson(JSON.stringify(packageFile)), {
          parser: 'json-stringify',
        })
      );
    });
}
