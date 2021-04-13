const fs = require('fs-extra');

const allPackages = fs.readdirSync('./packages');

const nxPlugins = allPackages
  .filter((package) => package.startsWith('nx-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const esbuildPlugins = allPackages
  .filter((package) => package.startsWith('esbuild-plugin-'))
  .map((package) => package.replace('-plugin-', '-'));

const WORKSPACE_CONFIGURATION_SCOPE = 'workspace';
const DOCUMENTATION_SCOPE = 'docs';
const WEBSITE_SCOPE = 'website';
const ADD_PLUGIN_SCOPE = 'add-plugin';
const DELETE_PLUGIN_SCOPE = 'delete-plugin';

module.exports = {
  types: [
    { value: ':tada: init', name: 'init:     initial commit' },
    { value: ':sparkles: feat', name: 'feat:     features!' },
    { value: ':pencil: docs', name: 'docs:     doc modifications' },
    { value: ':construction: chore', name: 'chore:    related works' },
    { value: ':bug: fix', name: 'fix:      bug fixtures' },
    { value: ':wrench: chore', name: 'chore:    configuration mutations' },
    { value: ':ambulance: fix', name: 'fix:      emergency correction' },
    { value: ':zap: perf', name: 'perf:     performance optimization' },
    { value: ':lipstick: ui', name: 'ui:       update UI' },
    { value: ':construction_worker: ci', name: 'ci:       add CI build' },
    { value: ':green_heart: ci', name: 'ci:       fix CI build' },
    { value: ':white_check_mark: test', name: 'test:     tests' },
    { value: ':hammer: refactor', name: 'refactor: code refactor' },
    { value: ':lock: fix', name: 'fix:      severity secure fixtures' },
    { value: ':rocket: deploy', name: 'deploy:   deploy' },
    { value: ':art: style', name: 'style:    code style' },
    { value: ':globe_with_meridians: i18n', name: 'i18n:     i18n' },
    { value: 'revert', name: 'revert:   revert version' },
    { value: ':heavy_plus_sign: add', name: 'add:      add deps' },
    { value: ':arrow_down: minus', name: 'minus:    remove deps' },
    { value: ':fire: del', name: 'del:      remove code file' },
    { value: ':pencil2: docs', name: 'docs:     documentation' },
    { value: ':bookmark: release', name: 'release:  release new version' },
  ],
  scopes: [
    ...nxPlugins,
    ...esbuildPlugins,
    WORKSPACE_CONFIGURATION_SCOPE,
    DOCUMENTATION_SCOPE,
    WEBSITE_SCOPE,
    ADD_PLUGIN_SCOPE,
    DELETE_PLUGIN_SCOPE,
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
