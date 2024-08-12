"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockS3Service = void 0;
const common_1 = require("@nestjs/common");
const hash_util_1 = require("../../utils/hash.util");
exports.MockS3Service = {
    createPresignedUrlWithClientForPut: jest.fn((userId, type) => {
        const filenameArray = type.map((curType) => `${userId}/${(0, hash_util_1.generateUuid)()}.${curType}`);
        return filenameArray.map((curFileName) => ({
            filename: curFileName,
            url: 'https://aws.s3/' + curFileName,
        }));
    }),
    deleteObjects: jest.fn((userId, filenames) => {
        for (const curFilename of filenames) {
            if (curFilename.startsWith('default/'))
                return true;
            if (parseInt(curFilename.split('/')[0]) !== userId) {
                throw new common_1.ForbiddenException(`User ${userId} is not owner of the file ${curFilename}`);
            }
        }
    }),
    deleteSingleObject: jest.fn(),
    deleteObjectFolder: jest.fn(),
};
//# sourceMappingURL=s3.service.js.map