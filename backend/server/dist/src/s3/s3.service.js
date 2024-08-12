"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const winstonLogger_service_1 = require("../common/logger/winstonLogger.service");
const hash_util_1 = require("../utils/hash.util");
const BUCKET_NAME = 'dangdangbucket';
let S3Service = class S3Service {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.s3Client = new client_s3_1.S3Client({ region: this.configService.getOrThrow('AWS_S3_REGION') });
    }
    makeFileName(userId, type) {
        return type.map((curType) => `${userId}/${(0, hash_util_1.generateUuid)()}.${curType}`);
    }
    async createPresignedUrlWithClientForPut(userId, type) {
        const filenameArray = this.makeFileName(userId, type);
        const presignedUrlInfoPromises = filenameArray.map(async (curFileName) => {
            const command = new client_s3_1.PutObjectCommand({
                Bucket: BUCKET_NAME,
                ContentType: `image/${type}`,
                Key: curFileName,
            });
            const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3Client, command, { expiresIn: 3600 });
            return { filename: curFileName, url };
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
        for (const curFilename of filenames) {
            if (curFilename.startsWith('default/'))
                continue;
            if (!this.checkUserIdInFilename(userId, curFilename)) {
                throw new common_1.ForbiddenException(`유저 ${userId}은 이미지 ${curFilename}에 대한 접근 권한이 없습니다`);
            }
            objectArray.push({ Key: curFilename });
        }
        const input = {
            Bucket: BUCKET_NAME,
            Delete: {
                Objects: objectArray,
            },
        };
        const command = new client_s3_1.DeleteObjectsCommand(input);
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filenames} 파일을 성공적으로 삭제했습니다`);
        }
        catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filenames} 파일 삭제에 실패했습니다`, error ?? error.stack);
        }
    }
    async deleteSingleObject(userId, filename) {
        if (filename.startsWith('default/'))
            return;
        if (!this.checkUserIdInFilename(userId, filename)) {
            throw new common_1.ForbiddenException(`유저 ${userId}은/는 ${filename}에 대한 접근 권한이 없습니다`);
        }
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
        });
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filename} 파일을 성공적으로 삭제했습니다`);
        }
        catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filename} 파일 삭제에 실패했습니다`, error ?? error.stack);
        }
    }
    async deleteObjectFolder(userId) {
        const filename = `${userId.toString()}/`;
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filename,
        });
        try {
            await this.s3Client.send(command);
            this.logger.log(`${BUCKET_NAME} 버킷에서 ${filename} 파일을 성공적으로 삭제했습니다`);
        }
        catch (error) {
            this.logger.error(`${BUCKET_NAME} 버킷에서 ${filename} 파일 삭제에 실패했습니다`, error ?? error.stack);
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        winstonLogger_service_1.WinstonLoggerService])
], S3Service);
//# sourceMappingURL=s3.service.js.map