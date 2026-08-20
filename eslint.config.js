import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      // Aturan hook adalah alasan utama linter ini ada di proyek realtime:
      // dependency array yang salah pada efek langganan SignalR menghasilkan
      // stream yang mati diam-diam — kelas kesalahan yang tidak dilihat `tsc`.
      //
      // `recommended-latest` adalah bentuk flat-config pada plugin versi 5;
      // `configs.flat.recommended` yang ditulis template bawaan tidak ada di
      // versi ini dan membuat ESLint gagal memuat config sama sekali.
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      // Parameter yang sengaja dibuang saat destructuring diberi awalan `_`
      // (mis. `const { key: _key, ...field } = draft`). Tanpa pola ini, satu-satunya
      // cara melewati aturan adalah menonaktifkannya per baris.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrors: 'none',
          ignoreRestSiblings: true,
        },
      ],
    },
  },
])
