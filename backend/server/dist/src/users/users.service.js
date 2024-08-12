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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const role_type_1 = require("./types/role.type");
const users_entity_1 = require("./users.entity");
const users_repository_1 = require("./users.repository");
const s3_service_1 = require("../s3/s3.service");
const users_dogs_service_1 = require("../users-dogs/users-dogs.service");
const hash_util_1 = require("../utils/hash.util");
const manipulate_util_1 = require("../utils/manipulate.util");
let UsersService = class UsersService {
    constructor(usersRepository, usersDogsService, s3Service) {
        this.usersRepository = usersRepository;
        this.usersDogsService = usersDogsService;
        this.s3Service = s3Service;
    }
    async findOne(where) {
        return await this.usersRepository.findOne(where);
    }
    async update(where, partialEntity) {
        return await this.usersRepository.update(where, partialEntity);
    }
    async updateAndFindOne(where, partialEntity) {
        return await this.usersRepository.updateAndFindOne(where, partialEntity);
    }
    async delete(userId) {
        await this.usersRepository.delete({ id: userId });
        await this.s3Service.deleteObjectFolder(userId);
    }
    async createIfNotExists({ oauthNickname, ...otherAttributes }) {
        const nickname = await this.generateUniqueNickname(oauthNickname);
        return await this.usersRepository.createIfNotExists(new users_entity_1.Users({
            nickname,
            role: role_type_1.ROLE.User,
            mainDogId: null,
            ...otherAttributes,
        }), 'oauthId');
    }
    async generateUniqueNickname(nickname) {
        let randomId = (0, hash_util_1.generateUuid)().slice(0, 10);
        let user = await this.usersRepository.findOneWithNoException({ nickname: `${nickname}#${randomId}` });
        while (user) {
            randomId = (0, hash_util_1.generateUuid)().slice(0, 10);
            user = await this.usersRepository.findOneWithNoException({ nickname: `${nickname}#${randomId}` });
        }
        return `${nickname}#${randomId}`;
    }
    async getOwnDogsList(userId) {
        return (await this.usersDogsService.find({ where: { userId }, select: ['dogId'] })).map((cur) => cur.dogId);
    }
    async checkDogOwnership(userId, dogId) {
        const myDogIds = (await this.usersDogsService.find({ where: { userId }, select: ['dogId'] })).map((cur) => cur.dogId);
        return (0, manipulate_util_1.checkIfExistsInArr)(myDogIds, dogId);
    }
    async getUserProfile({ userId, provider }) {
        const { nickname, email, profileImageUrl } = await this.usersRepository.findOne({
            where: { id: userId },
            select: ['nickname', 'email', 'profileImageUrl'],
        });
        return { nickname, email, profileImageUrl, provider };
    }
    async updateUserProfile(userId, userInfo) {
        const { nickname, profileImageUrl } = userInfo;
        if (nickname) {
            const nickname = await this.generateUniqueNickname(userInfo.nickname);
            userInfo.nickname = nickname;
        }
        if (profileImageUrl) {
            const curUserInfo = await this.usersRepository.findOne({ where: { id: userId } });
            if (curUserInfo && curUserInfo.profileImageUrl) {
                await this.s3Service.deleteSingleObject(userId, curUserInfo.profileImageUrl);
            }
        }
        await this.usersRepository.update({ id: userId }, userInfo);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        users_dogs_service_1.UsersDogsService,
        s3_service_1.S3Service])
], UsersService);
//# sourceMappingURL=users.service.js.map