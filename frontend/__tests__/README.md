# Frontend Tests

Uses [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/).

## Setup
```bash
cd /frontend
npm install
```

## Running Tests

```bash
# From frontend/
npm test          # Watch mode (re-runs on file changes)
npm run test:run  # Single run (CI-friendly)
npx vitest run __tests__/<file>.test.jsx  # Run a single test file
```

## Writing Tests

- Test files go in this directory as `ComponentName.test.jsx`
- Component `.js` files with JSX work without renaming — handled by a custom Vite plugin in `vitest.config.js`
- `next/image` and `next/link` are globally mocked in `vitest.setup.js`
- Vitest globals (`describe`, `it`, `expect`) and jest-dom matchers (`toBeInTheDocument`, etc.) are available without importing
