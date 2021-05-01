import enquirer from 'enquirer';
import minimist from 'minimist';

import { main as collectDeps } from './deps/collect-deps';
import { main as releaseProject } from './release/release';
import { main as convertImportType } from './import-type/convert-import-type';
import { readPackagesWithVersion } from './utils/read-packages';

// 先选择项目
// 再选择你要进行的操作
// 是否dryRun（目前只有一个script支持）

console.log(process.argv.slice(2));

type ScriptWithHandler = {
  script: string;
  handler: () => void | Promise<void>;
};

const avaliableScripts: ScriptWithHandler[] = [
  {
    script: 'collect deps',
    handler: collectDeps,
  },
  {
    script: 'create release',
    handler: releaseProject,
  },
  {
    script: 'convert import type',
    handler: convertImportType,
  },
];

async function main() {
  const packagesInfo = readPackagesWithVersion();

  // let { project }: Record<'project', string> = await enquirer.prompt({
  //   type: 'select',
  //   name: 'project',
  //   message: 'Select release project',
  //   choices: packagesInfo.map((info) => info.project),
  // });

  // let {
  //   script: targetScript,
  // }: Record<'script', string> = await enquirer.prompt({
  //   type: 'select',
  //   name: 'script',
  //   message: 'Select invoke script',
  //   choices: avaliableScripts.map((info) => info.script),
  // });

  // let { dryRun }: Record<'dryRun', string> = await enquirer.prompt({
  //   type: 'confirm',
  //   name: 'dryRun',
  //   message: 'Dry run?',
  //   initial: true,
  // });

  let { extraArgs }: Record<'extraArgs', string> = await enquirer.prompt({
    type: 'input',
    name: 'extraArgs',
    message: 'Extra args?',
  });

  // const handler = avaliableScripts.find(
  //   (scripts) => scripts.script === targetScript
  // ).handler;

  // handler();
}

main();
