import { ForbiddenException } from '@nestjs/common';

import { generateUuid } from '../../utils/hash.util';
import { PresignedUrlInfo } from '../types/presigned-url-info.type';

export const MockS3Service = {
    createPresignedUrlWithClientForPut: jest.fn((userId: number, type: string[]): PresignedUrlInfo[] => {
        const filenameArray = type.map((curType) => `${userId}/${generateUuid()}.${curType}`);
        return filenameArray.map((curFileName) => ({
            filename: curFileName,
            url: 'https://aws.s3/' + curFileName,
        }));
    }),

    deleteObjects: jest.fn((userId: number, filenames: string[]) => {
        for (const curFilename of filenames) {
            if (curFilename.startsWith('default/')) return true;

            if (parseInt(curFilename.split('/')[0]) !== userId) {
                throw new ForbiddenException(`User ${userId} is not owner of the file ${curFilename}`);
            }
        }
    }),

    deleteSingleObject: jest.fn(),

    deleteObjectFolder: jest.fn(),
};
