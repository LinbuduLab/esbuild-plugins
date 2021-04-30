const fs = require('fs-extra');

const allPackages = fs.readdirSync('./packages');

const nxPlugins = allPackages
  .filter((package) => package.startsWith('nx-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const esbuildPlugins = allPackages
  .filter((package) => package.startsWith('esbuild-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const vitePlugins = allPackages
  .filter((package) => package.startsWith('vite-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const snowpackPlugins = allPackages
  .filter((package) => package.startsWith('snowpack-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const umiPlugins = allPackages
  .filter((package) => package.startsWith('umi-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const WORKSPACE_CONFIGURATION_SCOPE = 'workspace';
const TOOLS_SCOPE = 'tools';
const ENHANCMENT_SCOPE = 'enhancement';
const DOCUMENTATION_SCOPE = 'docs';
const WEBSITE_SCOPE = 'website';
const ADD_PLUGIN_SCOPE = 'add-plugin';
const DELETE_PLUGIN_SCOPE = 'delete-plugin';
const EXAMPLE_SCOPE = 'example';
const WIP_SCOPE = 'wip';

const NX_PLUGIN_SHARED = 'nx-shared';
const ESBUILD_PLUGIN_SHARED = 'esbuild-shared';
const VITE_PLUGIN_SHARED = 'vite-shared';
const SNOWPACK_PLUGIN_SHARED = 'snowpack-shared';
const UMI_PLUGIN_SHARED = 'umi-shared';

// https://gitmoji.dev/
module.exports = {
  types: [
    { value: ':tada: init', name: 'init:     initial commit' },
    { value: ':sparkles: feat', name: 'feat:     features!' },
    { value: ':memo: docs', name: 'docs:     compose docs' },
    { value: ':pencil: docs', name: 'docs:     docs modifications' },
    { value: ':construction: chore', name: 'chore:    related works' },
    { value: ':children_crossing: example', name: 'chore:    update examples' },
    { value: ':bug: fix', name: 'fix:      bug fixtures' },
    { value: ':wrench: chore', name: 'chore:    workspace configuration' },
    { value: ':ambulance: fix', name: 'fix:      emergency correction' },
    { value: ':zap: perf', name: 'perf:     performance optimization' },
    { value: ':lipstick: ui', name: 'ui:       update UI' },
    { value: ':construction_worker: ci', name: 'ci:       add CI build' },
    { value: ':green_heart: ci', name: 'ci:       fix CI build' },
    { value: ':white_check_mark: test', name: 'test:     update test cases' },
    { value: ':hammer: refactor', name: 'refactor: code refactor' },
    {
      value: ':recycle: refactor',
      name: 'refactor: global code refactor',
    },
    { value: ':rotating_light: lint', name: 'chore:    lint' },
    { value: ':lock: fix', name: 'fix:      severity secure fixtures' },
    { value: ':rocket: deploy', name: 'deploy:   deploy' },
    { value: ':art: style', name: 'style:    code style' },
    { value: ':globe_with_meridians: i18n', name: 'i18n:     i18n' },
    { value: 'revert', name: 'revert:   revert version' },
    { value: ':heavy_plus_sign: add', name: 'add:      add deps' },
    { value: ':arrow_down: minus', name: 'minus:    remove deps' },
    { value: ':pushpin: deps', name: 'deps:     lock deps version' },
    { value: ':fire: del', name: 'del:      remove code file' },
    { value: ':pencil2: typo', name: 'typo:     fix typo' },
    { value: ':bookmark: release', name: 'release:  release new version' },
  ],
  scopes: [
    ...nxPlugins,
    ...esbuildPlugins,
    ...vitePlugins,
    ...snowpackPlugins,
    ...umiPlugins,
    WORKSPACE_CONFIGURATION_SCOPE,
    DOCUMENTATION_SCOPE,
    WEBSITE_SCOPE,
    ADD_PLUGIN_SCOPE,
    DELETE_PLUGIN_SCOPE,
    EXAMPLE_SCOPE,
    WIP_SCOPE,
    TOOLS_SCOPE,
    ENHANCMENT_SCOPE,
    NX_PLUGIN_SHARED,
    ESBUILD_PLUGIN_SHARED,
    VITE_PLUGIN_SHARED,
    SNOWPACK_PLUGIN_SHARED,
    UMI_PLUGIN_SHARED,
  ],
  disableEmoji: false,
  list: [
    'init',
    'feat',
    'fix',
    'chore',
    'docs',
    'perf',
    'ui',
    'ci',
    'test',
    'refactor',
    'deploy',
    'style',
    'i18n',
    'add',
    'minus',
    'del',
    'release',
    'example',
    'lint',
    'typo',
  ],
  questions: ['type', 'scope', 'subject', 'breaking', 'body', 'issues'],
  messages: {
    // TODO: generated from packages names
    type: '选择更改类型:\n',
    scope: '更改的范围:\n',
    subject: '简短描述:\n',
    body: '详细描述. 使用"|"换行:\n',
    footer: '关闭的issues列表. E.g.: #31, #34:\n',
    confirmCommit: '确认提交?',
  },
  allowCustomScopes: false,
  allowBreakingChanges: ['feat', 'fix'],
};
