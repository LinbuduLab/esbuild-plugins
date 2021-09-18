const fs = require('fs-extra');
const path = require('path');
const jsonfile = require('jsonfile');

const { pluginScope, workspaceScope } = jsonfile.readFileSync(
  path.resolve('./commit-scope.json')
);

const allPackages = fs.readdirSync('./packages');

const pluginRelatedScope = allPackages
  .filter((package) =>
    pluginScope.some((kind) => package.startsWith(`${kind}-plugin-`))
  )
  .map((package) => package.replace('-plugin-', '-'));

const pluginShared = pluginScope.map((kind) => `${kind}-shared`);

module.exports = {
  types: {
    init: {
      value: 'init',
      description: 'initial commit',
      emoji: '🎉',
    },
    feat: {
      value: 'feat',
      description: 'add features',
      emoji: '✨',
    },
    docs: {
      value: 'docs',
      description: 'update documentation',
      emoji: '📝',
    },
    typo: {
      value: 'typo',
      description: 'fix documentation typo',
      emoji: '✏️',
    },
    chore: {
      value: 'chore',
      description: 'related works',
      emoji: '🏗️',
    },
    example: {
      value: 'example',
      description: 'update examples',
      emoji: '🎬',
    },
    fix: {
      value: 'fix',
      description: 'bug fixtures',
      emoji: '🐛',
    },
    merge: {
      value: 'merge',
      description: 'merge branch',
      emoji: '🔀',
    },
    ['workspace-chore']: {
      value: 'chore',
      description: 'workspace configuration',
      emoji: '🏗️',
    },
    ['emergency-fix']: {
      value: 'emergency-fix',
      description: 'emergency correction',
      emoji: '🚑',
    },
    perf: {
      value: 'perf',
      description: 'performance optimization',
      emoji: '⚡',
    },
    ui: {
      value: 'ui',
      description: 'UI',
      emoji: '💄',
    },
    ci: {
      value: 'ci',
      description: 'add CI build',
      emoji: '👷',
    },
    ['fix-ci']: {
      value: 'fix-ci',
      description: 'fix CI build',
      emoji: '💚',
    },
    ['add-test']: {
      value: 'test',
      description: 'add test cases',
      emoji: '✅',
    },
    ['fix-test']: {
      value: 'test',
      description: 'fix test cases',
      emoji: '✅',
    },
    refactor: {
      value: 'refactor',
      description: 'code refactor',
      emoji: '🔨',
    },
    clean: {
      value: 'clean',
      description: 'clean file',
      emoji: '🔥',
    },
    lint: {
      value: 'lint',
      description: 'code lint',
      emoji: '🎨',
    },
    deploy: {
      value: 'deploy',
      description: 'site deploy',
      emoji: '🚀',
    },
    i18n: {
      value: 'i18n',
      description: 'i18n',
      emoji: '🌐',
    },
    deps: {
      value: 'deps',
      description: 'fix deps',
      emoji: '🐛',
    },
    'add-deps': {
      value: 'add-deps',
      description: 'add deps',
      emoji: '➕',
    },
    'minus-deps': {
      value: 'minus-deps',
      description: 'minus deps',
      emoji: '➖',
    },
    'upgrade-deps': {
      value: 'upgrade-deps',
      description: 'upgrade deps',
      emoji: '⬆️',
    },
    'downgrade-deps': {
      value: 'downgrade-deps',
      description: 'downgrade deps',
      emoji: '⬇️',
    },
    create: {
      value: 'create',
      description: 'create plugin package',
      emoji: '➕',
    },
    remove: {
      value: 'remove',
      description: 'remove plugin package',
      emoji: '➖',
    },
    release: {
      value: 'release',
      description: 'release project',
      emoji: '🔖',
    },
    config: {
      value: 'config',
      description: 'config modification',
      emoji: '🔧',
    },
    'fix-linux': {
      value: 'fix-linux',
      description: 'fix issues on linux',
      emoji: '🐧',
    },
    'fix-windows': {
      value: 'fix-windows',
      description: 'fix issues on windows',
      emoji: '🏁',
    },
    'fix-macos': {
      value: 'fix-macos',
      description: 'fix issues on macos',
      emoji: '🔖',
    },
  },
  scopes: [...pluginRelatedScope, ...pluginShared, ...workspaceScope],
  disableEmoji: false,
  list: [
    'init',
    'feat',
    'docs',
    'chore',
    'example',
    'fix',
    'workspace-chore',
    'emergency-fix',
    'perf',
    'ui',
    'ci',
    'fix-ci',
    'add-test',
    'fix-test',
    'refactor',
    'lint',
    'clean',
    'deploy',
    'i18n',
    'deps',
    'add-deps',
    'minus-deps',
    'upgrade-deps',
    'downgrade-deps',
    'create',
    'remove',
    'config',
    'typo',
    'release',
    'fix-linux',
    'fix-windows',
    'fix-macos',
  ],
  questions: ['type', 'scope', 'subject', 'breaking', 'body', 'issues'],
  messages: {
    type: 'Change Type:\n',
    scope: 'Change Scope:\n',
    subject: 'Brief Description:\n',
    body: 'Detailed Description. Use "|" for line break:\n',
    footer: 'Issues Closed. E.g.: #31, #34:\n',
    confirmCommit: 'Confirm?',
  },
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],
};
