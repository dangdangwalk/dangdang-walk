"use strict";
Object.defineProperty(exports, "S3Service", {
    enumerable: true,
    get: function() {
        return S3Service;
    }
});
const _clients3 = require("@aws-sdk/client-s3");
const _s3requestpresigner = require("@aws-sdk/s3-request-presigner");
const _common = require("@nestjs/common");
const _config = require("@nestjs/config");
const _winstonLoggerservice = require("../common/logger/winstonLogger.service");
const _hashutil = require("../utils/hash.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
const BUCKET_NAME = 'dangdangbucket';
let S3Service = class S3Service {
    makeFileName(userId, type) {
        return type.map((curType)=>`${userId}/${(0, _hashutil.generateUuid)()}.${curType}`);
    }
    async createPresignedUrlWithClientForPut(userId, type) {
        const filenameArray = this.makeFileName(userId, type);
        const presignedUrlInfoPromises = filenameArray.map(async (curFileName)=>{
            const command = new _clients3.PutObjectCommand({
                Bucket: BUCKET_NAME,
                ContentType: `image/${type}`,
                Key: curFileName
            });
            const url = await (0, _s3requestpresigner.getSignedUrl)(this.s3Client, command, {
                expiresIn: 3600
            });
            return {
                filename: curFileName,
                url
            };
        });
        return Promise.all(presignedUrlInfoPromises);
    }
    checkUserIdInFilename(userId, filename) {
        const filenameSplit = filename.split('/');
        if (parseInt(filenameSplit[0]) !== userId) {
            return false;
        }
        return true;
    }
    async deleteObjects(userId, filenames) {
        const objectArray = [];
        for (const curFilename of filenames){
            if (curFilename.startsWith('default/')) continue;
            if (!this.checkUserIdInFilename(userId, curFilename)) {
                throw new _common.ForbiddenException(`유저 ${userId}은 이미지 ${curFilename}에 대한 접근 권한이 없습니다`);
            }
            objectArray.push({
                Key: curFilename
            });
        }
        const input = {
            Bucket: BUCKET_NAME,
            Delete: {
                Objects: objectArray
            }
        };
        const command = new _clients3.DeleteObjectsCommand(input);
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filenames} 파일을 성공적으로 삭제했습니다`);
        } catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filenames} 파일 삭제에 실패했습니다`, error !== null && error !== void 0 ? error : error.stack);
        }
    }
    async deleteSingleObject(userId, filename) {
        if (filename.startsWith('default/')) return;
        if (!this.checkUserIdInFilename(userId, filename)) {
            throw new _common.ForbiddenException(`유저 ${userId}은/는 ${filename}에 대한 접근 권한이 없습니다`);
        }
        const command = new _clients3.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename
        });
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filename} 파일을 성공적으로 삭제했습니다`);
        } catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filename} 파일 삭제에 실패했습니다`, error !== null && error !== void 0 ? error : error.stack);
        }
    }
    async deleteObjectFolder(userId) {
        const filename = `${userId.toString()}/`;
        const command = new _clients3.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename
        });
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filename} 파일을 성공적으로 삭제했습니다`);
        } catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filename} 파일 삭제에 실패했습니다`, error !== null && error !== void 0 ? error : error.stack);
        }
    }
    constructor(configService, logger){
        this.configService = configService;
        this.logger = logger;
        this.s3Client = new _clients3.S3Client({
            region: this.configService.getOrThrow('AWS_S3_REGION')
        });
    }
};
S3Service = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _config.ConfigService === "undefined" ? Object : _config.ConfigService,
        typeof _winstonLoggerservice.WinstonLoggerService === "undefined" ? Object : _winstonLoggerservice.WinstonLoggerService
    ])
], S3Service);

//# sourceMappingURL=s3.service.js.map