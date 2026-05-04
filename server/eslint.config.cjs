module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        process: 'readonly',
        module: 'writable',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        console: 'readonly',
      },
      parserOptions: { ecmaVersion: 2021 },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];
