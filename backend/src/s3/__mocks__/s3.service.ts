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

    deleteObjects: jest.fn(),

    deleteSingleObject: jest.fn(),

    deleteObjectFolder: jest.fn(),
};
