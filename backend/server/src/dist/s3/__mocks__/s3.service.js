"use strict";
Object.defineProperty(exports, "MockS3Service", {
    enumerable: true,
    get: function() {
        return MockS3Service;
    }
});
const _common = require("@nestjs/common");
const _hashutil = require("../../utils/hash.util");
const MockS3Service = {
    createPresignedUrlWithClientForPut: jest.fn((userId, type)=>{
        const filenameArray = type.map((curType)=>`${userId}/${(0, _hashutil.generateUuid)()}.${curType}`);
        return filenameArray.map((curFileName)=>({
                filename: curFileName,
                url: 'https://aws.s3/' + curFileName
            }));
    }),
    deleteObjects: jest.fn((userId, filenames)=>{
        for (const curFilename of filenames){
            if (curFilename.startsWith('default/')) return true;
            if (parseInt(curFilename.split('/')[0]) !== userId) {
                throw new _common.ForbiddenException(`User ${userId} is not owner of the file ${curFilename}`);
            }
        }
    }),
    deleteSingleObject: jest.fn(),
    deleteObjectFolder: jest.fn()
};

//# sourceMappingURL=s3.service.js.map