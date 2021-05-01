const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');

const { pluginKind, workspace: workspaceScope } = jsonfile.readFileSync(
  path.resolve('./commit-scope.json')
);

const allPackages = fs.readdirSync('./packages');

const pluginRelatedScope = allPackages
  .filter((package) =>
    pluginKind.some((kind) => package.startsWith(`${kind}-plugin-`))
  )
  .map((package) => package.replace('-plugin-', '-'));

const pluginShared = pluginKind.map((kind) => `${kind}-shared`);

// // https://gitmoji.dev/
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
  scopes: [...pluginRelatedScope, ...pluginShared, ...workspaceScope],
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
