const { rules } = require("eslint-config-prettier");

module.exports = {
  root: true,
  extends: [
    '@react-native',
    'prettier',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'react',
    'react-hooks',
    'import',
    'simple-import-sort',
    'sort-keys-fix',
    '@typescript-eslint',
  ],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
    'max-len': ["warn", { "code": 100 }],
    'no-lone-blocks': 0,
    "@typescript-eslint/no-var-requires": 1,
    "@typescript-eslint/no-require-imports": 1,
    "@typescript-eslint/no-namespace": "off",
    "react/display-name": 0,
    "react/prop-types": 0,
    'prettier/prettier': 0,
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-shadow": "error",
    '@typescript-eslint/ban-ts-comment': 'off',
    quotes: ['error', 'single'],
    'no-empty-pattern': 'error',
    'no-multi-spaces': 'warn',
    'no-shadow': 'off',
    'react/no-children-prop': 'off',
    'no-multi-spaces': 'warn',
    'sort-keys-fix/sort-keys-fix': 'warn',
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'import/first': 'warn',
    'import/newline-after-import': 'warn',
    'import/no-duplicates': 'warn',
    'react/no-unstable-nested-components': [
      'off' | 'warn' | 'error',
      {
        allowAsProps: true | false,
        customValidators:
          [] /* optional array of validators used for propTypes validation */,
      },
    ],
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
        'simple-import-sort/imports': [
          'warn',
          {
            groups: [
              // Packages `react` related packages come first.
              ['^react', '^@?\\w'],
              // Src packages.
              ['^(@src)(/.*|$)'],
              // Side effect imports.
              ['^\\u0000'],
              // Parent imports. Put `..` last.
              ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
              // Other relative imports. Put same-folder imports and `.` last.
              ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
              // Style imports.
              ['^.+\\.?(styles)$'],
            ],
          },
        ],
      },
    },
  ],
}
