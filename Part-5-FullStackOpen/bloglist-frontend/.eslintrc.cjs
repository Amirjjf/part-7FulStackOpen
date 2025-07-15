module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react'],
  rules: {
    'no-console': 'warn', // Warn if console.log is used
    'react/prop-types': 'warn', // Warn if PropTypes are missing
    'eqeqeq': 'error', // Enforce strict equality (===)
    'no-unused-vars': 'warn', // Warn about unused variables
    'react/react-in-jsx-scope': 'off' // Disable React in scope warning for React 17+
  },
  settings: {
    react: {
      version: 'detect' // Detect the React version automatically
    }
  }
};
