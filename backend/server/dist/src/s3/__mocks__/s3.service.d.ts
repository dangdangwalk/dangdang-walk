/// <reference types="jest" />
import { PresignedUrlInfo } from '../types/presigned-url-info.type';
export declare const MockS3Service: {
    createPresignedUrlWithClientForPut: jest.Mock<PresignedUrlInfo[], [userId: number, type: string[]], any>;
    deleteObjects: jest.Mock<true | undefined, [userId: number, filenames: string[]], any>;
    deleteSingleObject: jest.Mock<any, any, any>;
    deleteObjectFolder: jest.Mock<any, any, any>;
};
