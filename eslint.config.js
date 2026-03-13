import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react/jsx-uses-vars': 'error',           // Erkennt JSX-Komponentenreferenzen als "used"
      'react/jsx-uses-react': 'error',          // Erkennt React-Import als "used"
      // setState in useEffect ist ein etabliertes Pattern für prop-driven forms (z. B. Formular-Reset bei
      // Datumswechsel). Hier als Warnung statt Error, da kein echter Bug vorliegt.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
])
