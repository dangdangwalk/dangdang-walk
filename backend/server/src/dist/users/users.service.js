"use strict";
Object.defineProperty(exports, "UsersService", {
    enumerable: true,
    get: function() {
        return UsersService;
    }
});
const _common = require("@nestjs/common");
const _roletype = require("./types/role.type");
const _usersentity = require("./users.entity");
const _usersrepository = require("./users.repository");
const _s3service = require("../s3/s3.service");
const _usersdogsservice = require("../users-dogs/users-dogs.service");
const _hashutil = require("../utils/hash.util");
const _manipulateutil = require("../utils/manipulate.util");
function _ts_decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function _ts_metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}
let UsersService = class UsersService {
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
        await this.usersRepository.delete({
            id: userId
        });
        await this.s3Service.deleteObjectFolder(userId);
    }
    async createIfNotExists({ oauthNickname, ...otherAttributes }) {
        const nickname = await this.generateUniqueNickname(oauthNickname);
        return await this.usersRepository.createIfNotExists(new _usersentity.Users({
            nickname,
            role: _roletype.ROLE.User,
            mainDogId: null,
            ...otherAttributes
        }), 'oauthId');
    }
    async generateUniqueNickname(nickname) {
        let randomId = (0, _hashutil.generateUuid)().slice(0, 10);
        let user = await this.usersRepository.findOneWithNoException({
            nickname: `${nickname}#${randomId}`
        });
        while(user){
            randomId = (0, _hashutil.generateUuid)().slice(0, 10);
            user = await this.usersRepository.findOneWithNoException({
                nickname: `${nickname}#${randomId}`
            });
        }
        return `${nickname}#${randomId}`;
    }
    async getOwnDogsList(userId) {
        return (await this.usersDogsService.find({
            where: {
                userId
            },
            select: [
                'dogId'
            ]
        })).map((cur)=>cur.dogId);
    }
    async checkDogOwnership(userId, dogId) {
        const myDogIds = (await this.usersDogsService.find({
            where: {
                userId
            },
            select: [
                'dogId'
            ]
        })).map((cur)=>cur.dogId);
        return (0, _manipulateutil.checkIfExistsInArr)(myDogIds, dogId);
    }
    async getUserProfile({ userId, provider }) {
        const { nickname, email, profileImageUrl } = await this.usersRepository.findOne({
            where: {
                id: userId
            },
            select: [
                'nickname',
                'email',
                'profileImageUrl'
            ]
        });
        return {
            nickname,
            email,
            profileImageUrl,
            provider
        };
    }
    async updateUserProfile(userId, userInfo) {
        const { nickname, profileImageUrl } = userInfo;
        if (nickname) {
            const nickname = await this.generateUniqueNickname(userInfo.nickname);
            userInfo.nickname = nickname;
        }
        if (profileImageUrl) {
            const curUserInfo = await this.usersRepository.findOne({
                where: {
                    id: userId
                }
            });
            if (curUserInfo && curUserInfo.profileImageUrl) {
                await this.s3Service.deleteSingleObject(userId, curUserInfo.profileImageUrl);
            }
        }
        await this.usersRepository.update({
            id: userId
        }, userInfo);
    }
    constructor(usersRepository, usersDogsService, s3Service){
        this.usersRepository = usersRepository;
        this.usersDogsService = usersDogsService;
        this.s3Service = s3Service;
    }
};
UsersService = _ts_decorate([
    (0, _common.Injectable)(),
    _ts_metadata("design:type", Function),
    _ts_metadata("design:paramtypes", [
        typeof _usersrepository.UsersRepository === "undefined" ? Object : _usersrepository.UsersRepository,
        typeof _usersdogsservice.UsersDogsService === "undefined" ? Object : _usersdogsservice.UsersDogsService,
        typeof _s3service.S3Service === "undefined" ? Object : _s3service.S3Service
    ])
], UsersService);

//# sourceMappingURL=users.service.js.map