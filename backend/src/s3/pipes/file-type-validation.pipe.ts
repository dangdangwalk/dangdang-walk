import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

import { isTypedArray } from '../../utils/validator.util';

const allowedFileTypes = [
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
] as const;

export type FileType = (typeof allowedFileTypes)[number];

@Injectable()
export class FileTypeValidationPipe implements PipeTransform<any, FileType[]> {
    readonly allowedExtensions = allowedFileTypes;

    transform(value: any): FileType[] {
        if (!isTypedArray(value, 'string')) {
            throw new BadRequestException('Validation failed (string array expected)');
        }

        const invalidFiles = value.filter(
            (type: string) => !this.allowedExtensions.includes(type.toLowerCase() as FileType),
        );

        if (invalidFiles.length > 0) {
            throw new BadRequestException(
                `Invalid file types: ${invalidFiles.join(', ')}. Allowed types are: ${this.allowedExtensions.join(', ')}`,
            );
        }

        return value as FileType[];
    }
}
