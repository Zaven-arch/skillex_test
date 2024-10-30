/** @type {import('eslint').Linter.FlatConfig} */
const config = [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    rules: {
      semi: ['error', 'never'], // No semicolons
      indent: ['error', 2], // Enforce 2-space indentation
      'max-len': [
        'error',
        {
          code: 100,
        },
      ], // Maximum line length of 100
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      'arrow-parens': ['error', 'always'],
    },
    ignores: ['node_modules', 'dist'],
  },
  {
    files: ['**/*.js'],
  },
]

module.exports = config
