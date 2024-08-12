import { PipeTransform } from '@nestjs/common';
declare const allowedFileTypes: readonly [
    'xbm',
    'tif',
    'jfif',
    'ico',
    'tiff',
    'gif',
    'svg',
    'webp',
    'svgz',
    'jpg',
    'jpeg',
    'png',
    'bmp',
    'pjp',
    'apng',
    'pjpeg',
    'avif',
];
export type FileType = (typeof allowedFileTypes)[number];
export declare class FileTypeValidationPipe implements PipeTransform<any, FileType[]> {
    readonly allowedExtensions: readonly [
        'xbm',
        'tif',
        'jfif',
        'ico',
        'tiff',
        'gif',
        'svg',
        'webp',
        'svgz',
        'jpg',
        'jpeg',
        'png',
        'bmp',
        'pjp',
        'apng',
        'pjpeg',
        'avif',
    ];
    transform(value: any): FileType[];
}
export {};
