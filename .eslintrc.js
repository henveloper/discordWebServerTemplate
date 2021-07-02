module.exports = {
    env: {
        es2021: true,
        mocha: true,

    },
    extends: [
        'airbnb-base',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint',
    ],
    settings: {
        'import/extensions': [ '.js', '.jsx', '.ts', '.tsx' ],
        'import/resolver': {
            node: {
                extensions: [ '.js', '.jsx', '.ts', '.tsx' ],
                moduleDirectory: [ 'node_modules', 'src/' ],
            },
        },
    },
    rules: {
        'import/prefer-default-export': 0,
        'no-trailing-spaces': 0,
        'arrow-parens': [ 2, 'as-needed' ],
        'template-curly-spacing': 0,
        'no-underscore-dangle': 0,
        'no-restricted-syntax': 0,
        'max-len': [ 2, 160 ],
        'no-await-in-loop': 0,
        'class-methods-use-this': 0,
        'no-nested-ternary': 0,
        'no-useless-constructor': 0,
        indent: [ 'error', 4 ],
        'object-curly-spacing': [ 2, 'always', {
            // objectsInObjects: false,
            // arraysInObjects: false,
        } ],
        'array-bracket-spacing': [ 2, 'always', {
            // objectsInArrays: false,
            arraysInArrays: false,
        } ],
        'object-curly-newline': [ 'error', {
            ObjectPattern: { consistent: true },
        } ],
        'import/extensions': [
            'error',
            'ignorePackages',
            {
                js: 'never',
                mjs: 'never',
                jsx: 'never',
                ts: 'never',
                tsx: 'never',
            },
        ],
        'lines-between-class-members': [ 'error', 'always', {
            exceptAfterSingleLine: true,
        } ],
        'no-plusplus': 'off',
        'no-unused-vars': 'off',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [ 'error', { ignoreTypeValueShadow: true } ],
        'no-continue': 'off',
        'no-mixed-operators': 'off',
        'linebreak-style': 'off',
        'no-loop-func': 'off',
    },
};
