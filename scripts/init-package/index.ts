import { CAC } from 'cac';
import fs from 'fs-extra';
import path from 'path';
import jsonfile from 'jsonfile';
import prettier from 'prettier';
import {
  CompilerOptions,
  ModuleKind,
  ModuleResolutionKind,
  ScriptTarget,
} from 'typescript';
import execa from 'execa';
import workspace from '../../workspace.json';
import tsconfigBase from '../../tsconfig.base.json';
import { selectSingleProject } from '../utils/select-project';
import { getPluginDir } from '../utils/constants';
import sortPackageJson from 'sort-package-json';
import ow from 'ow';

export default function useInitPackage(cli: CAC) {
  cli
    .command('init [name]', 'Init package configuration', {
      allowUnknownOptions: true,
    })
    .alias('i')
    .option('--prefix [prefix]', 'Apply `nx-plugin` prefix')
    .option('--no-prefix', 'Donot apply `nx-plugin` prefix')
    .option('--exist [exist]', 'Exist plugin', { default: false })
    .option('--no-exist', 'Non exist plugin')
    .action(
      async (name: string, options: { prefix: boolean; exist: boolean }) => {
        ow(name, ow.string);

        const pluginName =
          options.prefix && !name.startsWith('nx-plugin-')
            ? `nx-plugin-${name}`
            : name;

        !options.exist &&
          (await execa(
            `nx g @nrwl/nx-plugin:plugin`,
            [pluginName, `--importPath=${pluginName}`],
            {
              shell: true,
              stdio: 'inherit',
            }
          ));

        const dir = getPluginDir(pluginName);

        fs.ensureFileSync(path.resolve(dir, '.npmignore'));

        fs.writeFileSync(
          path.resolve(dir, '.npmignore'),
          JSON.stringify(npmIgnoreFile().trim())
        );

        fs.rmSync(path.resolve(dir, 'tsconfig.lib.json'), { force: true });
        fs.rmSync(path.resolve(dir, 'tsconfig.json'), { force: true });

        fs.writeFileSync(
          path.resolve(dir, 'tsconfig.json'),
          prettier.format(JSON.stringify(tsConfigJSON()), {
            parser: 'json-stringify',
          })
        );

        const originPkg = jsonfile.readFileSync(
          path.resolve(dir, 'package.json')
        );

        originPkg.name = pluginName;
        originPkg.version = options.exist ? originPkg.version : '0.0.1';
        originPkg.main = 'dist/src/index.js';
        originPkg.scripts = npmScripts();
        originPkg.generators = './dist/generators.json';
        originPkg.executors = './dist/executors.json';

        const initPackageJSONFields = packageJSON(pluginName);

        originPkg.homepage = initPackageJSONFields.homepage;
        originPkg.bugs = initPackageJSONFields.bugs;
        originPkg.repository = initPackageJSONFields.repository;
        originPkg.license = initPackageJSONFields.license;

        fs.writeFileSync(
          path.resolve(dir, 'package.json'),
          prettier.format(sortPackageJson(JSON.stringify(originPkg)), {
            parser: 'json-stringify',
          })
        );

        const originWorkspace: typeof workspace = jsonfile.readFileSync(
          path.resolve(__dirname, '../../workspace.json')
        );

        originWorkspace.projects[pluginName].targets.build.options.outputPath =
          workspaceJSON(pluginName)['build.options.outputPath'];

        originWorkspace.projects[pluginName].targets.build.options.tsConfig =
          workspaceJSON(pluginName)['build.options.tsConfig'];

        fs.writeFileSync(
          path.resolve(__dirname, '../../workspace.json'),
          prettier.format(JSON.stringify(originWorkspace), {
            parser: 'json-stringify',
          })
        );

        // tsconfig.json
        const originTSConfig: typeof tsconfigBase = jsonfile.readFileSync(
          path.resolve(__dirname, '../../tsconfig.base.json')
        );
        const originPathRecord = originTSConfig.compilerOptions.paths;

        for (const [k, v] of Object.entries(originPathRecord)) {
          if (k === `@nps/${pluginName}`) {
            originPathRecord[pluginName] = v;
            delete originPathRecord[k];
          }
        }

        fs.writeFileSync(
          path.resolve(__dirname, '../../tsconfig.base.json'),
          prettier.format(JSON.stringify(originTSConfig), {
            parser: 'json-stringify',
          })
        );
      }
    );
}

export const tsConfigJSON = (): {
  compilerOptions: CompilerOptions;
  include: string[];
} => {
  return {
    compilerOptions: {
      sourceMap: false,
      outDir: 'dist',
      declaration: true,
      importHelpers: false,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      moduleResolution: 'node' as unknown as ModuleResolutionKind,
      target: 'es2015' as unknown as ScriptTarget,
      module: 'CommonJS' as unknown as ModuleKind.CommonJS,
      lib: ['esnext', 'dom'],
      esModuleInterop: true,
      skipLibCheck: true,
      skipDefaultLibCheck: true,
      baseUrl: '.',
    },
    include: ['src'],
  };
};

export const packageJSON = (pluginName: string) => {
  return {
    homepage: `
      https://github.com/LinbuduLab/nx-plugins/tree/main/packages/${pluginName}#readme,
    `,
    bugs: {
      url: 'https://github.com/LinbuduLab/nx-plugins/issues',
    },
    repository: {
      type: 'git',
      url: 'git+https://github.com/LinbuduLab/nx-plugins.git',
    },
    license: 'MIT',
    author: 'Linbudu <linbudu599@gmail.com> (https://github.com/linbudu599)',
  };
};

export const npmScripts = () => {
  return {
    // release: 'release-it',
    // 'release:dry': 'release-it --dry-run',
    // 'release:minor': 'release-it minor',
    // 'release:major': 'release-it major',
  };
};

export const workspaceJSON = (plugin: string) => {
  return {
    'build.options.outputPath': `./packages/${plugin}/dist`,
    'build.options.tsConfig': `packages/${plugin}/tsconfig.json`,
  };
};

/**
 * @deprecated
 * @param plugin
 * @returns
 */
export const releaseItConfig = (plugin: string) => {
  return {
    github: {
      release: true,
      tokenRef: 'GITHUB_TOKEN',
    },
    npm: {
      skipChecks: true,
    },
    publishConfig: {
      access: 'public',
    },
    git: {
      commitMessage: `release: ${plugin} v\${version}`,
      changelog:
        'auto-changelog --stdout --commit-limit false -u --template https://raw.githubusercontent.com/release-it/release-it/master/templates/changelog-compact.hbs',
      tag: true,
      tagName: plugin,
      tagAnnotation: 'Release ${version}',
      push: true,
      pushArgs: ['--follow-tags'],
      addUntrackedFiles: true,
      requireCleanWorkingDir: false,
    },
    hooks: {
      'after:bump': 'auto-changelog -p',
    },
    plugins: {
      '@release-it/conventional-changelog': {
        preset: 'angular',
        infile: 'CHANGELOG.md',
      },
    },
  };
};

export const npmIgnoreFile = () => `
.babelrc
.eslintrc.json
.release-it.json
jest.config.js
tsconfig.spec.json
`;
