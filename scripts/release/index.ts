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

// prompt:
// release type
// dry
//
// git add packages/[package]
// git-cz
// release-it
//
// workflow

// 进入项目内
// 执行 release-it
//

export default function useReleaseProject(cli: CAC) {
  cli
    .command('release [name]', 'Release project', {
      allowUnknownOptions: true,
    })
    .alias('r')
    .action(async (name: string) => {
      console.log('name: ', name);
    });
}
