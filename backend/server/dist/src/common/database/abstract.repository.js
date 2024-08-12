"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractRepository = void 0;
const common_1 = require("@nestjs/common");
class AbstractRepository {
    constructor(entityRepository, entityManager) {
        this.entityRepository = entityRepository;
        this.entityManager = entityManager;
    }
    async create(entity) {
        return this.entityRepository.save(entity);
    }
    async createIfNotExists(entity, attributes) {
        const attributeList = Array.isArray(attributes) ? attributes : [attributes];
        const where = {};
        for (const attribute of attributeList) {
            where[attribute] = entity[attribute];
        }
        const existingEntity = await this.entityRepository.findOne({ where });
        if (existingEntity) {
            throw new common_1.ConflictException('createIfNotExists: 이미 존재하는 레코드입니다');
        }
        return this.create(entity);
    }
    async insert(entity) {
        return this.entityRepository.insert(entity);
    }
    async findOneWithNoException(where) {
        return this.entityRepository.findOne({ where });
    }
    async findOne(where) {
        const entity = await this.entityRepository.findOne(where);
        if (!entity) {
            throw new common_1.NotFoundException('findOne: 존재하지 않는 레코드입니다');
        }
        return entity;
    }
    async find(where) {
        const result = this.entityRepository.find(where);
        if (!result) {
            throw new common_1.NotFoundException('find: 존재하지 않는 레코드입니다');
        }
        return result;
    }
    async update(where, partialEntity) {
        const updateResult = await this.entityRepository.update(where, partialEntity);
        if (!updateResult.affected) {
            throw new common_1.NotFoundException('update: 존재하지 않는 레코드입니다');
        }
        return updateResult;
    }
    async delete(where) {
        const deleteResult = await this.entityRepository.delete(where);
        if (!deleteResult.affected) {
            throw new common_1.NotFoundException('delete: 존재하지 않는 레코드입니다');
        }
        return deleteResult;
    }
    async updateAndFindOne(where, partialEntity) {
        const updateResult = await this.entityRepository.update(where, partialEntity);
        if (!updateResult.affected) {
            throw new common_1.NotFoundException('update: 존재하지 않는 레코드입니다');
        }
        const options = { where };
        return this.findOne(options);
    }
}
exports.AbstractRepository = AbstractRepository;
//# sourceMappingURL=abstract.repository.js.map