import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        include: ['src/**/*.test.ts?(x)'],
        globals: true,
        environment: 'jsdom',
        setupFiles: './src/setupTests.ts',
        css: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'], // 원하는 리포터 설정
            reportsDirectory: './coverage', // 커버리지 리포트가 저장될 디렉토리
            include: ['src/**/*.{ts,tsx}'], // 커버리지 포함 파일 설정
            exclude: ['node_modules', 'tests'], // 커버리지 제외 파일 설정
        },
    },
    server: {
        port: 3000,
    },
});
