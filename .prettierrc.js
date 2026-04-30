module.exports = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
  endOfLine: 'lf',
  plugins: [
    '@trivago/prettier-plugin-sort-imports',
    'prettier-plugin-sh',
    'prettier-plugin-tailwindcss',
  ],
  importOrderSeparation: true,
  importOrder: ['^#(.*)$', '^[./]'],
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ['typescript', 'jsx'],
  overrides: [
    { files: '*.ts', options: { importOrderParserPlugins: ['typescript'] } },
  ],
}
