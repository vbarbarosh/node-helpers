const js = require('@eslint/js');
const globals = require('globals');

module.exports = [
    {
        ignores: ['bin/**', 'demos/**', 'dist/**', 'dist.templ/**', 'docs/**', 'gotchas/**', 'notes/**', 'research/**'],
    },
    {
        ...js.configs.recommended,
        files: ['src/**/*.js', 'webpack.config.js', 'eslint.config.js'],
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: 'commonjs',
            globals: {...globals.node, ...globals.mocha},
        },
        rules: {
            ...js.configs.recommended.rules,
            // Unused function params document callback signatures (onopentag
            // handlers, express (req, res), ...) — only flag unused locals
            'no-unused-vars': ['error', {args: 'none', caughtErrors: 'none'}],
            // if (m = line.match(...)) chains are an intentional idiom here
            'no-cond-assign': 'off',
            // for (;;)-style intentional infinite loops with internal breaks
            'no-constant-condition': ['error', {checkLoops: false}],
            'no-empty': ['error', {allowEmptyCatch: true}],
        },
    },
    {
        files: ['src/browser/index.js'],
        languageOptions: {
            globals: {...globals.browser, require: 'readonly', __VERSION__: 'readonly'},
        },
    },
];
