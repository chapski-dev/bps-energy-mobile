const {
    defineConfig,
    globalIgnores,
} = require('eslint/config');

const {
    fixupConfigRules,
    fixupPluginRules,
} = require('@eslint/compat');

const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const _import = require('eslint-plugin-import');
const simpleImportSort = require('eslint-plugin-simple-import-sort');
const sortKeysFix = require('eslint-plugin-sort-keys-fix');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const js = require('@eslint/js');

const {
    FlatCompat,
} = require('@eslint/eslintrc');

const compat = new FlatCompat({
    allConfig: js.configs.all,
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended
});

const {
    rules,
} = require('eslint-config-prettier');

module.exports = defineConfig([{
    extends: fixupConfigRules(compat.extends(
        '@react-native',
        'prettier',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'eslint:recommended',
        'plugin:prettier/recommended',
    )),

    plugins: {
        '@typescript-eslint': fixupPluginRules(typescriptEslint),
        import: fixupPluginRules(_import),
        react: fixupPluginRules(react),
        'react-hooks': fixupPluginRules(reactHooks),
        'simple-import-sort': simpleImportSort,
        'sort-keys-fix': sortKeysFix,
    },

    rules: {
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-interface': 0,

        '@typescript-eslint/no-namespace': 'off',

        '@typescript-eslint/no-require-imports': 1,
        '@typescript-eslint/no-shadow': 'error',
        '@typescript-eslint/no-unused-vars': ['error'],
        '@typescript-eslint/no-var-requires': 1,
        'import/first': 'warn',
        'import/newline-after-import': 'warn',
        'import/no-duplicates': 'warn',
        'max-len': ['warn', {
            'code': 100,
        }],
        'no-empty-pattern': 'error',
        'no-lone-blocks': 0,
        'no-multi-spaces': 'warn',
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        'prettier/prettier': 0,
        quotes: ['error', 'single'],
        'react/display-name': 0,
        'react/no-children-prop': 'off',
        'react/no-unstable-nested-components': ['off' | 'warn' | 'error', {
            allowAsProps: true | false,
            customValidators: [],
        }],
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 0,
        'simple-import-sort/exports': 'warn',
        'simple-import-sort/imports': 'warn',

        'sort-keys-fix/sort-keys-fix': 'warn',
    },
}, {
    files: ['**/*.ts', '**/*.tsx'],

    rules: {
        'no-undef': 'off',

        'simple-import-sort/imports': ['warn', {
            groups: [
                ['^react', '^@?\\w'],
                ['^(@src)(/.*|$)'],
                ['^\\u0000'],
                ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                ['^.+\\.?(styles)$'],
            ],
        }],
    },
}, globalIgnores([
    '**/node_modules',
    '**/__tests__',
    '**/__mocks__',
    '**/.eslintrc.js',
    '**/babel.config.js',
])]);
