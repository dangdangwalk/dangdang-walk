import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        target: 'esnext',
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  test: {
    globals: true,
    alias: {
      '@src': '/src',
      '@test': '/test',
    },
    root: './',
    coverage: {
      enabled: false, // Enable coverage
      provider: 'v8',
      thresholds: {
        branches: 100,
        functions: 57.14,
        lines: 81.08,
        statements: 81.08,
      },
    },
  },
  resolve: {
    alias: {
      '@src': '/src',
      '@test': '/test',
    },
  },
});
