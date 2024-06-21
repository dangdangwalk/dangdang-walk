import { isImageFileName } from '@/utils/url';
import { describe, expect, test } from 'vitest';

describe('유틸 함수 isImageFileName은', () => {
    test('S3에 업로드된 이미지의 fileName 형식에 대해 true를 반환한다.', () => {
        expect(isImageFileName('1/8bd7fb6e-351d-4224-bf8a-1e855c018de9.png')).toBe(true);
    });
    test('S3에 업로드된 이미지의 fileName 형식이 처음에 있지 않은 것에 대해 false를 반환한다.', () => {
        expect(isImageFileName('/static/media/1/8bd7fb6e-351d-4224-bf8a-1e855c018de9.png')).toBe(false);
        expect(isImageFileName('data:image/png;base64,1/8bd7fb6e-351d-4224-bf8a-1e855c018de9.png')).toBe(false);
    });
    test('정적 자산 형식에 대해 false를 반환한다.', () => {
        expect(isImageFileName('/static/media/default-dog.bb2c5fbbf292bff8ee8face288e54913.svg')).toBe(false);
    });
    test('base64 형식에 대해 false를 반환한다.', () => {
        expect(isImageFileName('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAANSUhEUoAAAANSUhEU')).toBe(false);
    });
});
