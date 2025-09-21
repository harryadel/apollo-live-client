# Changelog

## 1.0.0 - Major Modernization (2025-09-21)

### BREAKING CHANGES
- **Updated React to >=16.8.0** - Requires React Hooks support
- **Replaced `react-apollo` with `@apollo/client`** - Modern Apollo Client v3+
- **Converted class components to functional components with hooks**
- **Full TypeScript rewrite** - Better type safety and developer experience
- **Replaced TSLint with ESLint** - Modern linting with TypeScript support

### Added
- ✨ Modern React hooks-based `ReactiveQuery` component
- 🔧 Full TypeScript support with strict type checking
- 📦 Modern package.json with proper exports and module fields
- 🧪 Updated testing setup with nyc for coverage
- 🎯 ESLint configuration with TypeScript and React plugins
- 📚 Enhanced type exports for better DX

### Changed
- 🔄 Converted `ReactiveQuery.js` to `ReactiveQuery.tsx`
- ⬆️ Updated all dependencies to latest versions
- 🏗️ Modernized build configuration and TypeScript settings
- 🎨 Improved code formatting and linting rules

### Removed
- 🗑️ Removed deprecated `tslint.json`
- 🗑️ Removed Istanbul in favor of nyc
- 🗑️ Removed PropTypes (replaced with TypeScript interfaces)

### 0.1.1

* Add support for Render Prop Function
