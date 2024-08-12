import { ForbiddenException } from 'server/src/node_modules/@nestjs/common';

import { PresignedUrlInfo } from '../../../src/s3/types/presigned-url-info.type';
import { generateUuid } from '../../../src/utils/hash.util';

export const MockS3Service = {
    createPresignedUrlWithClientForPut: (userId: number, type: string[]): PresignedUrlInfo[] => {
        const filenameArray = type.map((curType) => `${userId}/${generateUuid()}.${curType}`);
        return filenameArray.map((curFileName) => ({
            filename: curFileName,
            url: 'https://aws.s3/' + curFileName,
        }));
    },

    deleteObjects: (userId: number, filenames: string[]) => {
        for (const curFilename of filenames) {
            if (curFilename.startsWith('default/')) return true;

            if (parseInt(curFilename.split('/')[0]) !== userId) {
                throw new ForbiddenException(`User ${userId} is not owner of the file ${curFilename}`);
            }
        }
    },

    deleteSingleObject: () => {},

    deleteObjectFolder: () => {},
};
