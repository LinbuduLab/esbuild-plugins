module.exports = {
  extents: ['cz'],
  rules: {
    'body-leading-blank': [1, 'always'],
    'footer-leading-blank': [1, 'always'],
    'header-max-length': [1, 'always', 71],
    'scope-case': [1, 'never', 'lower-case'],
    'subject-case': [
      1,
      'never',
      ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
    ],
    'subject-empty': [1, 'never'],
    'subject-full-stop': [1, 'never', '.'],
    'type-case': [1, 'always', 'lower-case'],
    'type-empty': [1, 'never'],
    'type-enum': [1, 'always', []],
  },
};
